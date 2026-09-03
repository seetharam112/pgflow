import { prisma } from '../lib/prisma';
import { NotFoundError, BadRequestError } from '../utils/errors';

export async function createPayment(data: {
  rentId: string;
  amount: number;
  method: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  reference?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: { ...data, status: 'COMPLETED' },
    });

    const rent = await tx.rent.findUnique({
      where: { id: data.rentId },
      include: { payments: true },
    });
    if (!rent) throw new NotFoundError('Rent record not found');

    const totalPaid = rent.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    let status: 'PENDING' | 'PARTIAL' | 'PAID' = 'PENDING';
    if (totalPaid >= Number(rent.amount)) status = 'PAID';
    else if (totalPaid > 0) status = 'PARTIAL';

    await tx.rent.update({
      where: { id: data.rentId },
      data: { paidAmount: totalPaid, status },
    });

    return payment;
  });
}

export async function getPaymentsByRent(rentId: string) {
  return prisma.payment.findMany({
    where: { rentId },
    orderBy: { paidAt: 'desc' },
  });
}

export async function getPayments(organizationId: string) {
  return prisma.payment.findMany({
    where: { rent: { tenant: { organizationId } } },
    include: { rent: true },
    orderBy: { paidAt: 'desc' },
  });
}

export async function getPayment(id: string, organizationId: string) {
  const payment = await prisma.payment.findFirst({
    where: { id, rent: { tenant: { organizationId } } },
    include: { rent: true },
  });
  if (!payment) throw new NotFoundError('Payment not found');
  return payment;
}

export async function updatePayment(
  id: string,
  organizationId: string,
  data: Partial<{ amount: number; method: 'CASH' | 'UPI' | 'BANK_TRANSFER'; reference: string; status: 'PENDING' | 'COMPLETED' | 'FAILED' }>
) {
  await getPayment(id, organizationId);
  return prisma.payment.update({ where: { id }, data });
}

export async function deletePayment(id: string, organizationId: string) {
  await getPayment(id, organizationId);
  return prisma.payment.delete({ where: { id } });
}
