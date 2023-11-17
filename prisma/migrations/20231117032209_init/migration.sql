/*
  Warnings:

  - You are about to drop the column `profile_pic_url` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Thread` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_content_id_fkey`;

-- DropForeignKey
ALTER TABLE `Content` DROP FOREIGN KEY `Content_content_parent_id_fkey`;

-- DropForeignKey
ALTER TABLE `Content` DROP FOREIGN KEY `Content_owner_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_content_id_fkey`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Thread` DROP FOREIGN KEY `Thread_content_id_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `profile_pic_url`;

-- DropTable
DROP TABLE `Comment`;

-- DropTable
DROP TABLE `Content`;

-- DropTable
DROP TABLE `Like`;

-- DropTable
DROP TABLE `Thread`;
