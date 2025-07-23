import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 60, unique: true, nullable: false })
  usuario: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  senha: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  perfil: 'admin' | 'professor' | 'aluno';

  @Column({ type: 'varchar', length: 10, default: 'ativo', nullable: false })
  situacao: 'ativo' | 'inativo';

  @CreateDateColumn({ name: 'dt_inclusao', nullable: false })
  dtInclusao: Date;
}