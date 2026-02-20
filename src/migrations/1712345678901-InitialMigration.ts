import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1712345678901 implements MigrationInterface {
    name = 'InitialMigration1712345678901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" text NOT NULL, "imageUrl" varchar, "category" varchar NOT NULL DEFAULT ('entertainment'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer)`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer, "postId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" text NOT NULL, "imageUrl" varchar, "category" varchar NOT NULL DEFAULT ('entertainment'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer, CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post"("id", "title", "content", "imageUrl", "category", "createdAt", "updatedAt", "authorId") SELECT "id", "title", "content", "imageUrl", "category", "createdAt", "updatedAt", "authorId" FROM "post"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`ALTER TABLE "temporary_post" RENAME TO "post"`);
        await queryRunner.query(`CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer, "postId" integer, CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment"("id", "content", "createdAt", "authorId", "postId") SELECT "id", "content", "createdAt", "authorId", "postId" FROM "comment"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment" RENAME TO "comment"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" RENAME TO "temporary_comment"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer, "postId" integer)`);
        await queryRunner.query(`INSERT INTO "comment"("id", "content", "createdAt", "authorId", "postId") SELECT "id", "content", "createdAt", "authorId", "postId" FROM "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "temporary_comment"`);
        await queryRunner.query(`ALTER TABLE "post" RENAME TO "temporary_post"`);
        await queryRunner.query(`CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" text NOT NULL, "imageUrl" varchar, "category" varchar NOT NULL DEFAULT ('entertainment'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer)`);
        await queryRunner.query(`INSERT INTO "post"("id", "title", "content", "imageUrl", "category", "createdAt", "updatedAt", "authorId") SELECT "id", "title", "content", "imageUrl", "category", "createdAt", "updatedAt", "authorId" FROM "temporary_post"`);
        await queryRunner.query(`DROP TABLE "temporary_post"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
