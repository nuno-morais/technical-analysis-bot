/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationContextService } from './../services/authorization-context.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public constructor(
    private readonly authorizationContextService: AuthorizationContextService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    return isPublic || super.canActivate(context);
  }

  public handleRequest(err, user, info, context) {
    if (err || user == null || user == false) {
      throw err || new UnauthorizedException(info);
    }

    this.authorizationContextService.context = user;
    return user;
  }
}
