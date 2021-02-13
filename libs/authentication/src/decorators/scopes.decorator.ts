import { SetMetadata } from '@nestjs/common';

export const Scopes = (...scopes: Array<string>) =>
  SetMetadata('scopes', scopes);
