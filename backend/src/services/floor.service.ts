import { prisma } from '../lib/prisma';
import { NotFoundError } from '../utils/errors';

export async function createFloor(data: {
  propertyId: string;
  name: string;
  floorNumber: number;
}) {
  return prisma.floor.create({ data });
}

export async function getFloorsByProperty(propertyId: string) {
  return prisma.floor.findMany({
    where: { propertyId },
    include: { rooms: { include: { beds: true } } },
    orderBy: { floorNumber: 'asc' },
  });
}

export async function getFloorById(id: string) {
  const floor = await prisma.floor.findUnique({
    where: { id },
    include: { rooms: { include: { beds: true } }, property: true },
  });
  if (!floor) throw new NotFoundError('Floor not found');
  return floor;
}

export async function updateFloor(
  id: string,
  data: Partial<{ name: string; floorNumber: number }>
) {
  await getFloorById(id);
  return prisma.floor.update({ where: { id }, data });
}

export async function deleteFloor(id: string) {
  await getFloorById(id);
  return prisma.floor.delete({ where: { id } });
}
