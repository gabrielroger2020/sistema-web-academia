import { Request, Response, NextFunction } from 'express';

export function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {

  const { perfil } = request.user;

  if (perfil !== 'admin') {
    return response.status(403).json({
      message: 'Acesso negado. Requer perfil de Administrador.',
    });
  }

  return next();
}