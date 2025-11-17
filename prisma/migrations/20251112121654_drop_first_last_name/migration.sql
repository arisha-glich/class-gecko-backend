-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'ORGANIZATION_ADMIN';

-- DropIndex
DROP INDEX "public"."user_email_key";

-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "role" SET DEFAULT 'ORGANIZATION_ADMIN';
