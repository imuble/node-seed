import { TokenExpiredError } from 'jsonwebtoken';
import { InvalidCredentialsError } from './InvalidCredentialsError';

export type AuthenticationError = InvalidCredentialsError | TokenExpiredError;
