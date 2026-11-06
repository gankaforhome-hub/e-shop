import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
// import { MongooseModule } from './mongoose/mongoose.module';

@Module({ providers: [PrismaService], exports: [PrismaService] })
export class DatabaseModule {}
