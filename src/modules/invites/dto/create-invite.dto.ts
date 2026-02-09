import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createInviteSchema = z.object({
  email: z.string().email(),
  listId: z.string().min(1),
});

export class CreateInviteDto extends createZodDto(createInviteSchema) {}
