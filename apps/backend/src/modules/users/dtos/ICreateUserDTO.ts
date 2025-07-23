export interface ICreateUserDTO {
  nome: string;
  usuario: string;
  senha: string;
  perfil: 'admin' | 'professor' | 'aluno';
}