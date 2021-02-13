import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jtw.strategy';
import { AuthorizationContextService } from './services/authorization-context.service';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, AuthorizationContextService],
  exports: [AuthorizationContextService],
})
export class AuthenticationModule {}
