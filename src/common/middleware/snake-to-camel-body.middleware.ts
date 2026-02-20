import { Request, Response, NextFunction } from 'express';
import { keysSnakeToCamel } from '../utils/snake-to-camel';

/**
 * Converts request body keys from snake_case to camelCase.
 * Must run after body-parser. Register in main.ts with app.use() so it runs
 * after Nest's default middleware.
 */
export function snakeToCamelBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    req.body = keysSnakeToCamel(req.body) as Request['body'];
  }
  next();
}
