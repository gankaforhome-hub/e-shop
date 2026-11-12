import { normalizeEmail } from '@common/utils';
import { IAuthUser } from '@modules/auth/interfaces';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer, E_ConsentSource } from '@prisma/client';
import {
  type ConsentContext,
  CustomerRepository,
  type NewCustomer,
} from './customer.repository';
import { UpdateProfileDto } from './dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  create(customer: NewCustomer, context: ConsentContext) {
    return this.customerRepository.create(
      { ...customer, email: normalizeEmail(customer.email) },
      context,
    );
  }

  findByEmail(email: string): Promise<Customer | null> {
    return this.customerRepository.findByEmail(normalizeEmail(email));
  }

  findById(id: string): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }

  isPhoneTaken(phone: string): Promise<boolean> {
    return this.customerRepository.isPhoneTaken(phone);
  }

  //COMMENT the signed-in customer's own profile (names, phone, news and offers)
  async updateProfile(
    actor: IAuthUser,
    { firstName, lastName, phone, marketingConsent }: UpdateProfileDto,
    { ip, userAgent }: Omit<ConsentContext, 'source'>,
  ): Promise<Customer> {
    const current = await this.customerRepository.findById(actor.id);
    if (!current) {
      throw new NotFoundException();
    }

    const isNewPhone = phone !== undefined && phone !== current.phone;
    //COMMENT the same answer for any taken number: whose it is stays private
    if (isNewPhone && phone && (await this.isPhoneTaken(phone))) {
      throw new ConflictException('This phone can not be used');
    }

    return this.customerRepository.updateProfile(
      current,
      { firstName, lastName, phone, marketingEmail: marketingConsent },
      { source: E_ConsentSource.ACCOUNT, ip, userAgent },
    );
  }
}
