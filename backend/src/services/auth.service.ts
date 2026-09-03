import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { ConflictError, UnauthorizedError } from '../utils/errors';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  organizationName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function generateTokens(userId: string, email: string, role: string, organizationId: string | null) {
  const payload = { userId, email, role, organizationId };
  const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] });
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'] });
  return { accessToken, refreshToken };
}

export async function registerUser(data: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: 'OWNER',
      organization: {
        create: {
          name: data.organizationName,
          ownerId: 'temp',
        },
      },
    },
    include: { organization: true },
  });

  // Set the ownerId on the organization to the newly created user's ID
  const organization = await prisma.organization.update({
    where: { id: user.organization!.id },
    data: { ownerId: user.id },
  });

  // Update user with organizationId
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { organizationId: organization.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      organizationId: true,
    },
  });

  const tokens = generateTokens(
    updatedUser.id,
    updatedUser.email,
    updatedUser.role,
    updatedUser.organizationId
  );

  return { user: updatedUser, ...tokens };
}

export async function loginUser(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const tokens = generateTokens(user.id, user.email, user.role, user.organizationId);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    },
    ...tokens,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
    );

    return { accessToken };
  } catch {
    throw new UnauthorizedError('Invalid refresh token');
  }
}
