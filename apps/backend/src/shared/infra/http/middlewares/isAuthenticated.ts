import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../../../../config/auth';

interface ITokenPayload {
  perfil: 'admin' | 'professor' | 'aluno';
  iat: number;
  exp: number;
  sub: string;
}

export function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('Token JWT não encontrado.');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, perfil } = decoded as ITokenPayload;

    request.user = {
      id: sub,
      perfil: perfil,
    };

    return next();
  } catch {
    throw new Error('Token JWT inválido.');
  }
}