import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const acceptInviteSchema = z.object({
  inviteId: z.string().min(1),
});

export class AcceptInviteDto extends createZodDto(acceptInviteSchema) {}
