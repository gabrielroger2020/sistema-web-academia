import { compare } from 'bcryptjs';
import { sign, SignOptions  } from 'jsonwebtoken';
import authConfig from '../../../config/auth';
import { AppDataSource } from '../../../shared/infra/typeorm';
import { Usuario } from '../entities/Usuario';
import { IAuthenticateUserDTO } from '../dtos/IAuthenticateUserDTO';

interface IResponse {
  user: Omit<Usuario, 'senha'>;
  token: string;
}

export class AuthenticateUserService {
  public async execute({
    usuario,
    senha,
  }: IAuthenticateUserDTO): Promise<IResponse> {
    const userRepository = AppDataSource.getRepository(Usuario);

    const user = await userRepository.findOne({ where: { usuario } });

    if (!user) {
      throw new Error('Usuário ou senha incorretos.');
    }

    if (user.situacao === 'inativo') {
      throw new Error('Usuários inativos não podem acessar o sistema.');
    }

    const passwordMatched = await compare(senha, user.senha);

    if (!passwordMatched) {
      throw new Error('Usuário ou senha incorretos.');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const payload = {
      perfil: user.perfil,
    };

    const signOptions: SignOptions = {
      subject: user.id,
      expiresIn: expiresIn,
    };

    const token = sign(payload, secret, signOptions);

    const { senha: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}