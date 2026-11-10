import { IMailMessage, IMailTransport } from '../interfaces';

const RESEND_API_URL = 'https://api.resend.com/emails';
const REQUEST_TIMEOUT_MS = 10_000;

/** Sends through the Resend HTTP API (https://resend.com/docs/api-reference/emails/send-email). */
export class ResendMailTransport implements IMailTransport {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  //COMMENT throws on failure; MailService logs it without blocking the request
  async send({ to, subject, text }: IMailMessage): Promise<void> {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: this.from, to, subject, text }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => '');
      throw new Error(`Resend answered ${response.status}: ${details}`);
    }
  }
}
