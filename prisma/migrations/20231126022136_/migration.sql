/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Requests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[endpoint]` on the table `Requests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Requests_id_key` ON `Requests`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Requests_endpoint_key` ON `Requests`(`endpoint`);
