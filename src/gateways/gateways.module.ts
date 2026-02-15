import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ListGateway } from './list/list.gateway';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET!}),
  ],
  providers: [ListGateway],
  exports: [ListGateway],
})
export class GatewaysModule {}
