import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/response';
import * as complaintService from '../services/complaint.service';
import * as propertyService from '../services/property.service';

export async function createComplaint(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await propertyService.getPropertyById(req.body.propertyId, orgId);
  const complaint = await complaintService.createComplaint(req.body);
  successResponse(res, complaint, 'Complaint created successfully', 201);
}

export async function getComplaints(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const complaints = await complaintService.getComplaintsByOrganization(orgId);
  successResponse(res, complaints, 'Complaints fetched successfully');
}

export async function getMyComplaints(req: AuthenticatedRequest, res: Response) {
  const tenantId = req.user!.id;
  const complaints = await complaintService.getComplaintsByTenant(tenantId);
  successResponse(res, complaints, 'My complaints fetched successfully');
}

export async function getComplaint(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const complaint = await complaintService.getComplaintById(req.params.id, orgId);
  successResponse(res, complaint, 'Complaint fetched successfully');
}

export async function updateComplaint(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  const complaint = await complaintService.updateComplaint(req.params.id, orgId, req.body);
  successResponse(res, complaint, 'Complaint updated successfully');
}

export async function deleteComplaint(req: AuthenticatedRequest, res: Response) {
  const orgId = req.user!.organizationId!;
  await complaintService.deleteComplaint(req.params.id, orgId);
  successResponse(res, null, 'Complaint deleted successfully');
}
