/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    DROP COLUMN `profilePicture`,
    MODIFY `profile_pic_url` VARCHAR(150) NOT NULL DEFAULT '';
