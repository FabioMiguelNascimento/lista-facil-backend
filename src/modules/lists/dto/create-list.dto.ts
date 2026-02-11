import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createListSchema = z.object({
  title: z.string().min(1),
  icon: z.string().optional(),
});

export class CreateListDto extends createZodDto(createListSchema) {}
