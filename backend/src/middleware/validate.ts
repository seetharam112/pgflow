import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../utils/errors';

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      next(new BadRequestError(`Validation failed: ${messages}`));
      return;
    }
    next();
  };
}
