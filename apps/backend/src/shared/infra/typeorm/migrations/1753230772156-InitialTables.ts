import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialTables1753230772156 implements MigrationInterface {
    name = 'InitialTables1753230772156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuario" ("id" varchar PRIMARY KEY NOT NULL, "nome" varchar(60) NOT NULL, "usuario" varchar(60) NOT NULL, "senha" varchar(255) NOT NULL, "perfil" varchar(20) NOT NULL, "situacao" varchar(10) NOT NULL DEFAULT ('ativo'), "dt_inclusao" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_9921cd8ed63a072b8f93ead80f0" UNIQUE ("usuario"))`);
        await queryRunner.query(`CREATE TABLE "usuario_token" ("id" varchar PRIMARY KEY NOT NULL, "refresh_token" varchar(255) NOT NULL, "id_usuario" varchar NOT NULL, "expiracao_token" datetime NOT NULL, "dt_inclusao" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "avaliacao_imc" ("id" varchar PRIMARY KEY NOT NULL, "altura" decimal NOT NULL, "peso" decimal NOT NULL, "imc" decimal NOT NULL, "classificacao" varchar(30) NOT NULL, "id_usuario_avaliacao" varchar NOT NULL, "id_usuario_aluno" varchar NOT NULL, "dt_inclusao" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_usuario_token" ("id" varchar PRIMARY KEY NOT NULL, "refresh_token" varchar(255) NOT NULL, "id_usuario" varchar NOT NULL, "expiracao_token" datetime NOT NULL, "dt_inclusao" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_98f38347099798d02785592a671" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_usuario_token"("id", "refresh_token", "id_usuario", "expiracao_token", "dt_inclusao") SELECT "id", "refresh_token", "id_usuario", "expiracao_token", "dt_inclusao" FROM "usuario_token"`);
        await queryRunner.query(`DROP TABLE "usuario_token"`);
        await queryRunner.query(`ALTER TABLE "temporary_usuario_token" RENAME TO "usuario_token"`);
        await queryRunner.query(`CREATE TABLE "temporary_avaliacao_imc" ("id" varchar PRIMARY KEY NOT NULL, "altura" decimal NOT NULL, "peso" decimal NOT NULL, "imc" decimal NOT NULL, "classificacao" varchar(30) NOT NULL, "id_usuario_avaliacao" varchar NOT NULL, "id_usuario_aluno" varchar NOT NULL, "dt_inclusao" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_d276f2482c6d64ddc36c3229fa6" FOREIGN KEY ("id_usuario_avaliacao") REFERENCES "usuario" ("id") ON DELETE NO ACTION ON UPDATE CASCADE, CONSTRAINT "FK_b3b4bd4196d4d625dc4307412e8" FOREIGN KEY ("id_usuario_aluno") REFERENCES "usuario" ("id") ON DELETE NO ACTION ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_avaliacao_imc"("id", "altura", "peso", "imc", "classificacao", "id_usuario_avaliacao", "id_usuario_aluno", "dt_inclusao") SELECT "id", "altura", "peso", "imc", "classificacao", "id_usuario_avaliacao", "id_usuario_aluno", "dt_inclusao" FROM "avaliacao_imc"`);
        await queryRunner.query(`DROP TABLE "avaliacao_imc"`);
        await queryRunner.query(`ALTER TABLE "temporary_avaliacao_imc" RENAME TO "avaliacao_imc"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avaliacao_imc" RENAME TO "temporary_avaliacao_imc"`);
        await queryRunner.query(`CREATE TABLE "avaliacao_imc" ("id" varchar PRIMARY KEY NOT NULL, "altura" decimal NOT NULL, "peso" decimal NOT NULL, "imc" decimal NOT NULL, "classificacao" varchar(30) NOT NULL, "id_usuario_avaliacao" varchar NOT NULL, "id_usuario_aluno" varchar NOT NULL, "dt_inclusao" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "avaliacao_imc"("id", "altura", "peso", "imc", "classificacao", "id_usuario_avaliacao", "id_usuario_aluno", "dt_inclusao") SELECT "id", "altura", "peso", "imc", "classificacao", "id_usuario_avaliacao", "id_usuario_aluno", "dt_inclusao" FROM "temporary_avaliacao_imc"`);
        await queryRunner.query(`DROP TABLE "temporary_avaliacao_imc"`);
        await queryRunner.query(`ALTER TABLE "usuario_token" RENAME TO "temporary_usuario_token"`);
        await queryRunner.query(`CREATE TABLE "usuario_token" ("id" varchar PRIMARY KEY NOT NULL, "refresh_token" varchar(255) NOT NULL, "id_usuario" varchar NOT NULL, "expiracao_token" datetime NOT NULL, "dt_inclusao" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "usuario_token"("id", "refresh_token", "id_usuario", "expiracao_token", "dt_inclusao") SELECT "id", "refresh_token", "id_usuario", "expiracao_token", "dt_inclusao" FROM "temporary_usuario_token"`);
        await queryRunner.query(`DROP TABLE "temporary_usuario_token"`);
        await queryRunner.query(`DROP TABLE "avaliacao_imc"`);
        await queryRunner.query(`DROP TABLE "usuario_token"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
    }

}
