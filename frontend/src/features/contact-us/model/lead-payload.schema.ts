import { z } from 'zod';

import { getLeadFormSchema } from './lead-form.schema';

/** Where a lead came from; one id per form placement. */
export const LEAD_FORM_IDS = ['contacts_form', 'exclusive_form'] as const;

export type LeadFormId = (typeof LEAD_FORM_IDS)[number];

/**
 * Server-side contract for `POST /api/leads`. The client sends already
 * validated values; the body is untrusted, so every rule runs again (messages
 * are validation keys, not UI copy).
 */
export const leadPayloadSchema = z.object({
  formId: z.enum(LEAD_FORM_IDS),
  sourcePage: z.string().startsWith('/').max(2048),
  submittedAt: z.string().datetime(),
  formData: getLeadFormSchema(key => key),
});

export type LeadPayload = z.output<typeof leadPayloadSchema>;
