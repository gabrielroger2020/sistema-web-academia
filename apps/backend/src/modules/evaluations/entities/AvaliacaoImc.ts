import { Usuario } from '../../users/entities/Usuario';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('avaliacao_imc')
export class AvaliacaoImc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', nullable: false })
  altura: number;

  @Column({ type: 'decimal', nullable: false })
  peso: number;

  @Column({ type: 'decimal', nullable: false })
  imc: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  classificacao: string;

  @Column({ name: 'id_usuario_avaliacao', nullable: false })
  idUsuarioAvaliacao: string;

  @Column({ name: 'id_usuario_aluno', nullable: false })
  idUsuarioAluno: string;

  @ManyToOne(() => Usuario, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario_avaliacao' })
  avaliador: Usuario;

  @ManyToOne(() => Usuario, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario_aluno' })
  aluno: Usuario;

  @CreateDateColumn({ name: 'dt_inclusao' })
  dtInclusao: Date;
}