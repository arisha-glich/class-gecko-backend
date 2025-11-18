-- AlterTable
ALTER TABLE "public"."BusinessOrganization" ADD COLUMN     "address" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "defaultCommissionRate" DOUBLE PRECISION;
