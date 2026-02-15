import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { InvitesModule } from './modules/invites/invites.module';
import { ItemsModule } from './modules/items/items.module';
import { ListsModule } from './modules/lists/lists.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, ListsModule, InvitesModule, PrismaModule, UsersModule, ItemsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
