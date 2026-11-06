export const MAIL_TRANSPORT = 'MAIL_TRANSPORT';

export interface IMailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface IMailTransport {
  send(message: IMailMessage): Promise<void>;
}
