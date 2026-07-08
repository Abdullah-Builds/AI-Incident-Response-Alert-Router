/*
  Warnings:

  - You are about to drop the column `assignedTeam` on the `incidents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "incidents" DROP COLUMN "assignedTeam",
ADD COLUMN     "recommended_action" JSONB;
