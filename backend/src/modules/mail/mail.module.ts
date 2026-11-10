import { MAIL_FROM, NODE_ENV, RESEND_API_KEY } from '@common/constants';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_TRANSPORT } from './interfaces';
import { MailService } from './mail.service';
import { ConsoleMailTransport } from './transports/console-mail.transport';
import { ResendMailTransport } from './transports/resend-mail.transport';

@Module({
  providers: [
    MailService,
    {
      provide: MAIL_TRANSPORT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const apiKey = config.get<string>(RESEND_API_KEY);
        const from = config.get<string>(MAIL_FROM);
        //COMMENT validateEnv requires MAIL_FROM whenever the key is set
        if (apiKey && from) {
          return new ResendMailTransport(apiKey, from);
        }
        //COMMENT fails on startup instead of silently losing every message
        if (config.get(NODE_ENV) === 'production') {
          throw new Error('No mail transport is configured for production');
        }
        return new ConsoleMailTransport();
      },
    },
  ],
  exports: [MailService],
})
export class MailModule {}
