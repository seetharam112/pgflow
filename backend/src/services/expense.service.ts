import { ExpenseCategory } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../utils/errors';

export async function createExpense(data: {
  organizationId: string;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  description?: string;
}) {
  return prisma.expense.create({ data });
}

export async function getExpensesByOrganization(organizationId: string) {
  return prisma.expense.findMany({
    where: { organizationId },
    orderBy: { date: 'desc' },
  });
}

export async function getExpenseById(id: string, organizationId: string) {
  const expense = await prisma.expense.findFirst({
    where: { id, organizationId },
  });
  if (!expense) throw new NotFoundError('Expense not found');
  return expense;
}

export async function updateExpense(
  id: string,
  organizationId: string,
  data: Partial<{ category: ExpenseCategory; amount: number; date: Date; description: string }>
) {
  await getExpenseById(id, organizationId);
  return prisma.expense.update({ where: { id }, data });
}

export async function deleteExpense(id: string, organizationId: string) {
  await getExpenseById(id, organizationId);
  return prisma.expense.delete({ where: { id } });
}
