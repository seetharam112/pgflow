import { prisma } from '../lib/prisma';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';

export async function moveIn(data: {
  tenantId: string;
  bedId: string;
  rent: number;
  startDate?: Date;
}) {
  const bed = await prisma.bed.findUnique({
    where: { id: data.bedId },
    include: { room: true, assignments: { where: { status: 'ACTIVE' } } },
  });
  if (!bed) throw new NotFoundError('Bed not found');
  if (bed.assignments.length > 0) {
    throw new ConflictError('Bed is already occupied');
  }

  const result = await prisma.$transaction(async (tx) => {
    const assignment = await tx.bedAssignment.create({
      data: {
        tenantId: data.tenantId,
        bedId: data.bedId,
        rent: data.rent,
        startDate: data.startDate || new Date(),
        status: 'ACTIVE',
      },
    });

    await tx.bed.update({
      where: { id: data.bedId },
      data: { status: 'OCCUPIED' },
    });

    return assignment;
  });

  return result;
}

export async function moveOut(assignmentId: string) {
  const assignment = await prisma.bedAssignment.findUnique({
    where: { id: assignmentId },
    include: { bed: true },
  });
  if (!assignment) throw new NotFoundError('Assignment not found');
  if (assignment.status !== 'ACTIVE') {
    throw new BadRequestError('This assignment is already ended');
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.bedAssignment.update({
      where: { id: assignmentId },
      data: { status: 'ENDED', endDate: new Date() },
    });

    await tx.bed.update({
      where: { id: assignment.bedId },
      data: { status: 'AVAILABLE' },
    });

    return updated;
  });
}

export async function getAssignmentsByTenant(tenantId: string) {
  return prisma.bedAssignment.findMany({
    where: { tenantId },
    include: { bed: { include: { room: { include: { floor: { include: { property: true } } } } } } },
    orderBy: { startDate: 'desc' },
  });
}

export async function getActiveAssignmentsByOrganization(organizationId: string) {
  return prisma.bedAssignment.findMany({
    where: { status: 'ACTIVE', tenant: { organizationId } },
    include: {
      tenant: true,
      bed: { include: { room: { include: { floor: { include: { property: true } } } } } },
    },
    orderBy: { startDate: 'desc' },
  });
}
