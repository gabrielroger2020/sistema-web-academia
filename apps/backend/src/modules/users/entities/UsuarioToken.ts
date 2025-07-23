import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './Usuario';

@Entity('usuario_token')
export class UsuarioToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'refresh_token', type: 'varchar', length: 255, nullable: false })
  refreshToken: string;

  @Column({ name: 'id_usuario', nullable: false })
  idUsuario: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ name: 'expiracao_token', nullable: false })
  expiracaoToken: Date;

  @CreateDateColumn({ name: 'dt_inclusao', nullable: false })
  dtInclusao: Date;
}