import { normalizeEmail } from '@common/utils';
import { minutes, normalizeIp, ThrottlerOptions } from '@nestjs/throttler';

//COMMENT guards run before validation, so the body can hold anything here
const getAccountEmail = (req: Record<string, any>) => {
  const email: unknown = req.body?.email;
  return typeof email === 'string' ? normalizeEmail(email) : '';
};

export const throttlers: ThrottlerOptions[] = [
  //COMMENT per IP, on every route
  { name: 'default', ttl: minutes(1), limit: 100 },
  //COMMENT per email and IP, wherever the body names an account. The IP stays in the key,
  //otherwise anyone could lock the owner out of an account by failing on purpose
  {
    name: 'account',
    ttl: minutes(15),
    limit: 10,
    skipIf: context =>
      !getAccountEmail(
        context.switchToHttp().getRequest<Record<string, any>>(),
      ),
    getTracker: req => `${getAccountEmail(req)}|${normalizeIp(String(req.ip))}`,
  },
];

export const STRICT_THROTTLE = { default: { limit: 5, ttl: minutes(1) } };
export const REFRESH_THROTTLE = { default: { limit: 30, ttl: minutes(1) } };
