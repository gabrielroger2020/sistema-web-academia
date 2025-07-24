import { Request, Response, NextFunction } from 'express';

export function ensureAdminOrProfessor(
  request: Request,
  response: Response,
  next: NextFunction,
) {

  // This check assumes that the isAuthenticated middleware has already run.
  
  const { perfil } = request.user;

  if (perfil === 'admin' || perfil === 'professor') {
    return next();
  }

  return response.status(403).json({
    message: 'Acesso negado. Requer perfil de Administrador ou Professor.',
  });
}