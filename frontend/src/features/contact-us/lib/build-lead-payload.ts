import { type LeadFormValues } from '../model/lead-form.schema';
import {
  type LeadFormId,
  type LeadPayload,
} from '../model/lead-payload.schema';

interface BuildLeadPayloadParams {
  formId: LeadFormId;
  /** Locale-less path of the page hosting the form (`/contacts`). */
  sourcePage: string;
  formData: LeadFormValues;
  now?: Date;
}

export function buildLeadPayload({
  formId,
  sourcePage,
  formData,
  now = new Date(),
}: BuildLeadPayloadParams): LeadPayload {
  return {
    formId,
    sourcePage,
    submittedAt: now.toISOString(),
    formData,
  };
}
