/*
  Warnings:

  - You are about to drop the column `parent_comment_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `content_discription` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `onwer_user_id` on the `Content` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[content_parent_id]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content_description` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_user_id` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_parent_comment_id_fkey`;

-- DropForeignKey
ALTER TABLE `Content` DROP FOREIGN KEY `Content_onwer_user_id_fkey`;

-- DropIndex
DROP INDEX `Content_content_discription_idx` ON `Content`;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `parent_comment_id`;

-- AlterTable
ALTER TABLE `Content` DROP COLUMN `content_discription`,
    DROP COLUMN `onwer_user_id`,
    ADD COLUMN `content_description` VARCHAR(300) NOT NULL,
    ADD COLUMN `content_parent_id` INTEGER NULL,
    ADD COLUMN `owner_user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Content_content_parent_id_key` ON `Content`(`content_parent_id`);

-- CreateIndex
CREATE INDEX `Content_owner_user_id_idx` ON `Content`(`owner_user_id`);

-- CreateIndex
CREATE INDEX `Content_content_description_idx` ON `Content`(`content_description`);

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_owner_user_id_fkey` FOREIGN KEY (`owner_user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_content_parent_id_fkey` FOREIGN KEY (`content_parent_id`) REFERENCES `Content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
