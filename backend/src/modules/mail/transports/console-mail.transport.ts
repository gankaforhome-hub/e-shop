import { Logger } from '@nestjs/common';
import { IMailMessage, IMailTransport } from '../interfaces';

//COMMENT development only: the messages contain one-time tokens
export class ConsoleMailTransport implements IMailTransport {
  private readonly logger = new Logger('Mail');

  async send({ to, subject, text }: IMailMessage): Promise<void> {
    this.logger.log(`To: ${to}\nSubject: ${subject}\n\n${text}`);
  }
}
