import { apiRoutes } from '@/shared/config/routes';

import { type LeadPayload } from '../model/lead-payload.schema';

const SUCCESS_STATUSES = new Set([200, 201]);

/** POSTs the lead; resolves `false` on network errors or non-2xx responses. */
export async function submitLead(payload: LeadPayload): Promise<boolean> {
  try {
    const response = await fetch(apiRoutes.leads, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return SUCCESS_STATUSES.has(response.status);
  } catch {
    return false;
  }
}
