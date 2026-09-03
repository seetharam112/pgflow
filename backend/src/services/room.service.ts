import { prisma } from '../lib/prisma';
import { NotFoundError } from '../utils/errors';

export async function createRoom(data: {
  floorId: string;
  roomNumber: string;
  capacity: number;
}) {
  return prisma.room.create({ data });
}

export async function getRoomsByFloor(floorId: string) {
  return prisma.room.findMany({
    where: { floorId },
    include: { beds: true },
    orderBy: { roomNumber: 'asc' },
  });
}

export async function getRoomById(id: string) {
  const room = await prisma.room.findUnique({
    where: { id },
    include: { beds: true, floor: { include: { property: true } } },
  });
  if (!room) throw new NotFoundError('Room not found');
  return room;
}

export async function updateRoom(
  id: string,
  data: Partial<{ roomNumber: string; capacity: number }>
) {
  await getRoomById(id);
  return prisma.room.update({ where: { id }, data });
}

export async function deleteRoom(id: string) {
  await getRoomById(id);
  return prisma.room.delete({ where: { id } });
}
