import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as paymentService from '../services/payment.service';
import * as rentService from '../services/rent.service';

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await rentService.getRentById(req.body.rentId, orgId);
  const payment = await paymentService.createPayment(req.body);
  successResponse(res, payment, 'Payment recorded successfully', 201);
}

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const payments = await paymentService.getPayments(orgId);
  successResponse(res, payments, 'Payments fetched successfully');
}

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const payment = await paymentService.getPayment(req.params.id, orgId);
  successResponse(res, payment, 'Payment fetched successfully');
}

export async function getPaymentsByRent(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await rentService.getRentById(req.params.rentId, orgId);
  const payments = await paymentService.getPaymentsByRent(req.params.rentId);
  successResponse(res, payments, 'Payments fetched successfully');
}

export async function updatePayment(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const payment = await paymentService.updatePayment(req.params.id, orgId, req.body);
  successResponse(res, payment, 'Payment updated successfully');
}

export async function deletePayment(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await paymentService.deletePayment(req.params.id, orgId);
  successResponse(res, null, 'Payment deleted successfully');
}
