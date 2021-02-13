/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationContext } from './../entities/authorization-context.entity';
import { AuthorizationContextService } from './../services/authorization-context.service';

@Injectable()
export class ScopesGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationContextService: AuthorizationContextService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    let result = false;
    const handler = context.getHandler();
    const scopes = this.reflector.get<Array<string>>('scopes', handler);

    if (scopes == null) {
      result = true;
    } else if (this.authorizationContextService.context != null) {
      const authorizationContext: AuthorizationContext = this
        .authorizationContextService.context;
      const hasScope = () =>
        !!authorizationContext.scopes.find(
          (scope) => !!scopes.find((item) => item === scope),
        );
      result =
        authorizationContext && authorizationContext.scopes && hasScope();
    }

    return result;
  }
}
