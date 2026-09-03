import { RentStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { NotFoundError, BadRequestError } from '../utils/errors';

export async function createRent(data: {
  tenantId: string;
  assignmentId: string;
  amount: number;
  dueDate: Date;
  month: number;
  year: number;
}) {
  return prisma.rent.create({ data });
}

export async function getRentsByOrganization(organizationId: string) {
  return prisma.rent.findMany({
    where: { tenant: { organizationId } },
    include: { tenant: true, payments: true, assignment: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRentById(id: string, organizationId: string) {
  const rent = await prisma.rent.findFirst({
    where: { id, tenant: { organizationId } },
    include: { tenant: true, payments: true, assignment: true },
  });
  if (!rent) throw new NotFoundError('Rent record not found');
  return rent;
}

export async function updateRentStatus(id: string, organizationId: string) {
  const rent = await getRentById(id, organizationId);
  let status: RentStatus = rent.status;

  const paidAmount = Number(rent.paidAmount);
  const rentAmount = Number(rent.amount);

  if (paidAmount === 0) status = 'PENDING';
  else if (paidAmount < rentAmount) status = 'PARTIAL';
  else if (paidAmount >= rentAmount) status = 'PAID';

  if (status !== rent.status) {
    return prisma.rent.update({ where: { id }, data: { status } });
  }
  return rent;
}

export async function getRentsByTenant(tenantId: string, organizationId: string) {
  return prisma.rent.findMany({
    where: { tenantId, tenant: { organizationId } },
    include: { payments: true },
    orderBy: { year: 'desc', month: 'desc' },
  });
}

export async function updateRent(
  id: string,
  organizationId: string,
  data: Partial<{ amount: number; dueDate: Date; month: number; year: number; status: RentStatus }>
) {
  await getRentById(id, organizationId);
  return prisma.rent.update({ where: { id }, data });
}

export async function deleteRent(id: string, organizationId: string) {
  await getRentById(id, organizationId);
  return prisma.rent.delete({ where: { id } });
}
