import { UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { NotFoundError, ConflictError } from '../utils/errors';

export async function getOrganization(organizationId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { users: { select: { id: true, name: true, email: true, role: true } } },
  });
  if (!org) throw new NotFoundError('Organization not found');
  return org;
}

export async function updateOrganization(organizationId: string, data: { name: string }) {
  return prisma.organization.update({
    where: { id: organizationId },
    data,
    include: { users: { select: { id: true, name: true, email: true, role: true } } },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  organizationId: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ConflictError('User with this email already exists');
  return prisma.user.create({
    data,
    select: { id: true, name: true, email: true, role: true, organizationId: true },
  });
}

export async function getUsersByOrganization(organizationId: string) {
  return prisma.user.findMany({
    where: { organizationId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}
