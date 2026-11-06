import { NODE_ENV } from '@common/constants';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_TRANSPORT } from './interfaces';
import { MailService } from './mail.service';
import { ConsoleMailTransport } from './transports/console-mail.transport';

@Module({
  providers: [
    MailService,
    {
      provide: MAIL_TRANSPORT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
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
