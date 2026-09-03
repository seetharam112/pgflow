import { prisma } from '../lib/prisma';

export async function getDashboardStats(organizationId: string) {
  const totalProperties = await prisma.property.count({ where: { organizationId } });
  const totalTenants = await prisma.tenant.count({ where: { organizationId } });

  const totalBeds = await prisma.bed.count({
    where: { room: { floor: { property: { organizationId } } } },
  });
  const occupiedBeds = await prisma.bed.count({
    where: { room: { floor: { property: { organizationId } } }, status: 'OCCUPIED' },
  });
  const availableBeds = totalBeds - occupiedBeds;

  const totalRentDue = await prisma.rent.aggregate({
    where: { tenant: { organizationId } },
    _sum: { amount: true },
  });
  const totalRentPaid = await prisma.rent.aggregate({
    where: { tenant: { organizationId } },
    _sum: { paidAmount: true },
  });

  const totalExpenses = await prisma.expense.aggregate({
    where: { organizationId },
    _sum: { amount: true },
  });

  const openComplaints = await prisma.complaint.count({
    where: { property: { organizationId }, status: { not: 'CLOSED' } },
  });

  const totalRooms = await prisma.room.count({
    where: { floor: { property: { organizationId } } },
  });

  const pendingPayments = await prisma.rent.count({
    where: { tenant: { organizationId }, status: { not: 'PAID' } },
  });

  const now = new Date();
  const monthlyRevenue = await prisma.payment.aggregate({
    where: {
      rent: { tenant: { organizationId } },
      status: 'COMPLETED',
      paidAt: {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      },
    },
    _sum: { amount: true },
  });

  const dueAmount = Number(totalRentDue._sum.amount || 0);
  const paidAmount = Number(totalRentPaid._sum.paidAmount || 0);

  return {
    totalProperties,
    totalTenants,
    totalRooms,
    totalBeds,
    occupiedBeds,
    availableBeds,
    occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
    totalRentDue: dueAmount,
    totalRentPaid: paidAmount,
    totalRentPending: dueAmount - paidAmount,
    totalExpenses: Number(totalExpenses._sum.amount || 0),
    openComplaints,
    pendingPayments,
    monthlyRevenue: Number(monthlyRevenue._sum.amount || 0),
  };
}

export async function getOccupancyBreakdown(organizationId: string) {
  const properties = await prisma.property.findMany({
    where: { organizationId },
    include: {
      floors: {
        include: {
          rooms: {
            include: {
              beds: { select: { status: true } },
            },
          },
        },
      },
    },
  });

  return properties.map((property) => {
    let totalBeds = 0;
    let occupiedBeds = 0;
    for (const floor of property.floors) {
      for (const room of floor.rooms) {
        totalBeds += room.beds.length;
        occupiedBeds += room.beds.filter((b) => b.status === 'OCCUPIED').length;
      }
    }
    return {
      propertyId: property.id,
      propertyName: property.name,
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
    };
  });
}
