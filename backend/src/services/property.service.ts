import { prisma } from '../lib/prisma';
import { NotFoundError } from '../utils/errors';

export async function createProperty(data: {
  organizationId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}) {
  return prisma.property.create({ data });
}

export async function getPropertiesByOrganization(organizationId: string) {
  return prisma.property.findMany({
    where: { organizationId },
    include: { floors: { include: { rooms: { include: { beds: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPropertyById(id: string, organizationId: string) {
  const property = await prisma.property.findFirst({
    where: { id, organizationId },
    include: { floors: { include: { rooms: { include: { beds: true } } } } },
  });
  if (!property) throw new NotFoundError('Property not found');
  return property;
}

export async function updateProperty(
  id: string,
  organizationId: string,
  data: Partial<{
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }>
) {
  await getPropertyById(id, organizationId);
  return prisma.property.update({ where: { id }, data });
}

export async function deleteProperty(id: string, organizationId: string) {
  await getPropertyById(id, organizationId);
  return prisma.property.delete({ where: { id } });
}
