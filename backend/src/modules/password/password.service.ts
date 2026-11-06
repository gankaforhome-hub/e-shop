import { Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcrypt';
// import { randomBytes, pbkdf2Sync } from 'crypto';
@Injectable()
export class PasswordService {
  getSalt() {
    return genSaltSync(10);
    // return randomBytes(16).toString('hex');
  }
  getHashPassword(password: string) {
    return hashSync(password, this.getSalt());
    //other method of hashing
    // return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }
}
