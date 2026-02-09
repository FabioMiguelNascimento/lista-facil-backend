import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateListSchema = z.object({
  title: z.string().min(1).optional(),
});

export class UpdateListDto extends createZodDto(updateListSchema) {}
