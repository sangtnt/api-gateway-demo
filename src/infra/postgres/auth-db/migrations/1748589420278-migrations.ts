import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748589420278 implements MigrationInterface {
    name = 'Migrations1748589420278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "auth_service"."users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying(255),
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                "updated_by" character varying(255),
                "version" integer NOT NULL,
                "user_name" character varying(255) NOT NULL,
                "email" character varying(255),
                "phone_number" character varying(20),
                "is_email_verified" boolean NOT NULL DEFAULT false,
                "is_phone_number_verified" boolean NOT NULL DEFAULT false,
                "hashed_password" character varying(255) NOT NULL,
                "display_name" character varying(100),
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_074a1f262efaca6aba16f7ed92" ON "auth_service"."users" ("user_name")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "auth_service"."users" ("email")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_17d1817f241f10a3dbafb169fd" ON "auth_service"."users" ("phone_number")
        `);
        await queryRunner.query(`
            CREATE TABLE "auth_service"."refresh_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying(255),
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                "updated_by" character varying(255),
                "version" integer NOT NULL,
                "user_id" uuid NOT NULL,
                "token" character varying(255) NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "revoked_at" TIMESTAMP WITH TIME ZONE,
                "family_id" uuid NOT NULL,
                CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"),
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4542dd2f38a61354a040ba9fd5" ON "auth_service"."refresh_tokens" ("token")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "auth_service"."IDX_4542dd2f38a61354a040ba9fd5"
        `);
        await queryRunner.query(`
            DROP TABLE "auth_service"."refresh_tokens"
        `);
        await queryRunner.query(`
            DROP INDEX "auth_service"."IDX_17d1817f241f10a3dbafb169fd"
        `);
        await queryRunner.query(`
            DROP INDEX "auth_service"."IDX_97672ac88f789774dd47f7c8be"
        `);
        await queryRunner.query(`
            DROP INDEX "auth_service"."IDX_074a1f262efaca6aba16f7ed92"
        `);
        await queryRunner.query(`
            DROP TABLE "auth_service"."users"
        `);
    }

}
