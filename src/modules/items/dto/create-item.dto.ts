import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createItemSchema = z.object({
  listId: z.string().min(1),
  content: z.string().min(1),
});

export class CreateItemDto extends createZodDto(createItemSchema) {}
