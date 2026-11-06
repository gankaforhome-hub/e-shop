import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
// import { randomBytes, pbkdf2Sync } from 'crypto';

const BCRYPT_ROUNDS = 12;
//COMMENT bcrypt hash of a random value, compared when an account has no password to check
const DUMMY_PASSWORD_HASH =
  '$2b$12$b/isO0iPEMtwZoF28KdRkuTWdss5kmOfsHoJItDR.rN4d.gBh44Ba';

@Injectable()
export class PasswordService {
  getSalt() {
    return genSalt(BCRYPT_ROUNDS);
    // return randomBytes(16).toString('hex');
  }
  async getHashPassword(password: string) {
    return hash(password, await this.getSalt());
    //other method of hashing
    // return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }
  //COMMENT always runs bcrypt, so the timing does not reveal whether the account exists
  async isPasswordValid(password: string, passwordHash?: string | null) {
    const isMatch = await compare(
      password,
      passwordHash ?? DUMMY_PASSWORD_HASH,
    );
    return !!passwordHash && isMatch;
  }
}
