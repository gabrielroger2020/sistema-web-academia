declare namespace Express {
  export interface Request {
    user: {
      id: string;
      perfil: 'admin' | 'professor' | 'aluno';
    };
  }
}