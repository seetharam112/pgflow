import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as expenseService from '../services/expense.service';

export async function createExpense(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const expense = await expenseService.createExpense({
    ...req.body,
    organizationId: orgId,
    date: new Date(req.body.date),
  });
  successResponse(res, expense, 'Expense recorded successfully', 201);
}

export async function getExpenses(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const expenses = await expenseService.getExpensesByOrganization(orgId);
  successResponse(res, expenses, 'Expenses fetched successfully');
}

export async function getExpense(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const expense = await expenseService.getExpenseById(req.params.id, orgId);
  successResponse(res, expense, 'Expense fetched successfully');
}

export async function updateExpense(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const data = req.body;
  if (data.date) data.date = new Date(data.date);
  const expense = await expenseService.updateExpense(req.params.id, orgId, data);
  successResponse(res, expense, 'Expense updated successfully');
}

export async function deleteExpense(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await expenseService.deleteExpense(req.params.id, orgId);
  successResponse(res, null, 'Expense deleted successfully');
}
