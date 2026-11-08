import { Prisma } from '@prisma/client';

// P2002 unique, P2003 foreign key, P2025 record not found
export function isPrismaError(error: unknown, code: string) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
  );
}
