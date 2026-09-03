import { ComplaintPriority, ComplaintStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { NotFoundError, BadRequestError } from '../utils/errors';

export async function createComplaint(data: {
  tenantId: string;
  propertyId: string;
  roomId?: string;
  category: string;
  title: string;
  description: string;
  priority?: ComplaintPriority;
}) {
  return prisma.complaint.create({
    data: { ...data, status: 'OPEN' as ComplaintStatus },
  });
}

export async function getComplaintsByOrganization(organizationId: string) {
  return prisma.complaint.findMany({
    where: { property: { organizationId } },
    include: { tenant: true, property: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getComplaintsByTenant(tenantId: string) {
  return prisma.complaint.findMany({
    where: { tenantId },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getComplaintById(id: string, organizationId: string) {
  const complaint = await prisma.complaint.findFirst({
    where: { id, property: { organizationId } },
    include: { tenant: true, property: true },
  });
  if (!complaint) throw new NotFoundError('Complaint not found');
  return complaint;
}

export async function updateComplaint(
  id: string,
  organizationId: string,
  data: Partial<{ status: ComplaintStatus; priority: ComplaintPriority; assignedTo: string }>
) {
  await getComplaintById(id, organizationId);
  return prisma.complaint.update({ where: { id }, data });
}

export async function deleteComplaint(id: string, organizationId: string) {
  await getComplaintById(id, organizationId);
  return prisma.complaint.delete({ where: { id } });
}
