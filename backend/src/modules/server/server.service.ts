import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerService {
  live(): boolean {
    return true;
  }
}
