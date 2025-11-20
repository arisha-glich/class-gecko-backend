/*
  Warnings:

  - You are about to drop the column `defaultCommissionRate` on the `BusinessOrganization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."BusinessOrganization" DROP COLUMN "defaultCommissionRate";

-- AlterTable
ALTER TABLE "public"."Commission" ALTER COLUMN "businessId" DROP NOT NULL;
