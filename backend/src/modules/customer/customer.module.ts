import { DatabaseModule } from '@database/database.module';
import { PasswordService } from '@modules/password/password.service';
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { CustomerService } from './customer.service';

//COMMENT storefront customers; staff accounts are in the staff module, never here
@Module({
  imports: [DatabaseModule],
  controllers: [CustomerController],
  providers: [CustomerRepository, CustomerService, PasswordService],
  exports: [CustomerService, PasswordService],
})
export class CustomerModule {}
