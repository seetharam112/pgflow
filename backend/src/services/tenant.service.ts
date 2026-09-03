import { prisma } from '../lib/prisma';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';

export async function createTenant(data: {
  organizationId: string;
  name: string;
  phone: string;
  email?: string;
  deposit?: number;
}) {
  return prisma.tenant.create({ data });
}

export async function getTenantsByOrganization(organizationId: string) {
  return prisma.tenant.findMany({
    where: { organizationId },
    include: { assignments: { where: { status: 'ACTIVE' }, include: { bed: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTenantById(id: string, organizationId: string) {
  const tenant = await prisma.tenant.findFirst({
    where: { id, organizationId },
    include: {
      assignments: {
        include: { bed: { include: { room: { include: { floor: { include: { property: true } } } } } } },
      },
      rents: { orderBy: { createdAt: 'desc' } },
      complaints: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');
  return tenant;
}

export async function updateTenant(
  id: string,
  organizationId: string,
  data: Partial<{ name: string; phone: string; email: string; deposit: number; status: string }>
) {
  await getTenantById(id, organizationId);
  return prisma.tenant.update({ where: { id }, data });
}

export async function deleteTenant(id: string, organizationId: string) {
  await getTenantById(id, organizationId);
  return prisma.tenant.delete({ where: { id } });
}
