import { hash } from 'bcryptjs';
import { AppDataSource } from '../../../shared/infra/typeorm';
import { Usuario } from '../entities/Usuario';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';

export class CreateUserService {
  public async execute({
    nome,
    usuario,
    senha,
    perfil,
  }: ICreateUserDTO): Promise<Usuario> {
    const userRepository = AppDataSource.getRepository(Usuario);

    const userExists = await userRepository.findOne({ where: { usuario } });

    if (userExists) {
      throw new Error('Este nome de usuário já está em uso.');
    }

    const hashedPassword = await hash(senha, 8);

    const newUser = userRepository.create({
      nome,
      usuario,
      senha: hashedPassword,
      perfil,
    });

    await userRepository.save(newUser);

    return newUser;
  }
}