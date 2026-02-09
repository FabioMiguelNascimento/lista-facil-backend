import { Module } from '@nestjs/common';
import { ListGateway } from './list/list.gateway';

@Module({
  providers: [ListGateway],
  exports: [ListGateway],
})
export class GatewaysModule {}
