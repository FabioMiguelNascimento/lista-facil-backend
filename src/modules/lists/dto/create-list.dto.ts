import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createListSchema = z.object({
  title: z.string().min(1),
});

export class CreateListDto extends createZodDto(createListSchema) {}
