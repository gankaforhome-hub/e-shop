import { JwtAuthGuard } from './jwt-auth.guard';
import { OriginGuard } from './origin.guard';

export const GUARDS = [JwtAuthGuard, OriginGuard];
