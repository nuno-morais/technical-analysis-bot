import { Injectable } from '@nestjs/common';
import { AuthorizationContext } from './../entities/authorization-context.entity';

@Injectable()
export class AuthorizationContextService {
  public context: AuthorizationContext;
}
