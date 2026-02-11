import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateUserSchema = z.object({
  avatarUrl: z.string().url().nullable().optional(),
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
