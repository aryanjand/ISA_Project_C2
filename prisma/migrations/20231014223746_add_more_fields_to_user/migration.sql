/*
  Warnings:

  - Added the required column `firstName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `firstName` VARCHAR(50) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(50) NOT NULL,
    ADD COLUMN `profilePicture` VARCHAR(255) NOT NULL;
