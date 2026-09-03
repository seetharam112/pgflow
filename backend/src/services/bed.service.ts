import { prisma } from '../lib/prisma';
import { NotFoundError } from '../utils/errors';

export async function createBed(data: {
  roomId: string;
  bedNumber: string;
  status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  monthlyRent?: number;
}) {
  return prisma.bed.create({ data });
}

export async function getBedsByRoom(roomId: string) {
  return prisma.bed.findMany({
    where: { roomId },
    orderBy: { bedNumber: 'asc' },
  });
}

export async function getBedById(id: string) {
  const bed = await prisma.bed.findUnique({
    where: { id },
    include: { room: { include: { floor: { include: { property: true } } } }, assignments: true },
  });
  if (!bed) throw new NotFoundError('Bed not found');
  return bed;
}

export async function updateBed(
  id: string,
  data: Partial<{ bedNumber: string; status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE'; monthlyRent: number }>
) {
  await getBedById(id);
  return prisma.bed.update({ where: { id }, data });
}

export async function deleteBed(id: string) {
  await getBedById(id);
  return prisma.bed.delete({ where: { id } });
}
