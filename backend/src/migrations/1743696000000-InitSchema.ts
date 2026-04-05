import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1743696000000 implements MigrationInterface {
  name = "InitSchema1743696000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "task_status_enum" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE')`);

    await queryRunner.query(`
      CREATE TABLE "User" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_User" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_User_email" ON "User" ("email")`);

    await queryRunner.query(`
      CREATE TABLE "RefreshToken" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tokenHash" character varying NOT NULL,
        "userId" uuid NOT NULL,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_RefreshToken" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_RefreshToken_tokenHash" ON "RefreshToken" ("tokenHash")`,
    );
    await queryRunner.query(`
      ALTER TABLE "RefreshToken"
      ADD CONSTRAINT "FK_RefreshToken_userId"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "Task" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying NOT NULL,
        "description" text,
        "status" "task_status_enum" NOT NULL DEFAULT 'TODO',
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_Task" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "Task"
      ADD CONSTRAINT "FK_Task_userId"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Task" DROP CONSTRAINT "FK_Task_userId"`);
    await queryRunner.query(`DROP TABLE "Task"`);
    await queryRunner.query(`ALTER TABLE "RefreshToken" DROP CONSTRAINT "FK_RefreshToken_userId"`);
    await queryRunner.query(`DROP TABLE "RefreshToken"`);
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TYPE "task_status_enum"`);
  }
}
