import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateItemSchema = z.object({
  content: z.string().min(1).optional(),
  checked: z.boolean().optional(),
});

export class UpdateItemDto extends createZodDto(updateItemSchema) {}
