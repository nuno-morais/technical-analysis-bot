import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import 'dotenv/config';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthorizationContext } from './../entities/authorization-context.entity';
import { Claim } from './../entities/claim';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(JwtStrategy.buildStrategyInput());
  }

  private static buildStrategyInput() {
    const result = {
      algorithms: [process.env.AUTH_ALGORITHM || 'RS256'],
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
    if (process.env.AUTH_SECRET != null) {
      return {
        ...result,
        secretOrKey: process.env.AUTH_SECRET.replace(/\\n/g, '\n'),
      };
    }
    return {
      ...result,
      audience: process.env.AUTH_AUDIENCE,
      issuer: process.env.AUTH_ISSUER,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH_ISSUER}.well-known/jwks.json`,
        rateLimit: true,
      }),
    };
  }

  public validate = (payload: Claim) =>
    new AuthorizationContext({
      accountId: payload.sub,
      scopes: (payload.scope || '').split(' '),
    });
}
