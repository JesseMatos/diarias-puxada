/*
  Warnings:

  - You are about to drop the column `arriveAt` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `departAt` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `driverCPF` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driverName` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "driverId" INTEGER NOT NULL,
    "driverName" TEXT NOT NULL,
    "driverCPF" TEXT NOT NULL,
    "driverPhone" TEXT,
    "departDepotAt" DATETIME,
    "arriveFactoryAt" DATETIME,
    "loadStartAt" DATETIME,
    "loadEndAt" DATETIME,
    "leaveFactoryAt" DATETIME,
    "arriveDepotAt" DATETIME,
    "startLat" REAL,
    "startLng" REAL,
    "endLat" REAL,
    "endLng" REAL,
    "totalTripHours" REAL,
    "travelToFactoryHours" REAL,
    "waitBeforeLoadHours" REAL,
    "loadingHours" REAL,
    "postLoadHours" REAL,
    "returnHours" REAL,
    "diarias" INTEGER,
    "refeicoes" INTEGER,
    "valorFinal" REAL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("driverId", "id", "status") SELECT "driverId", "id", "status" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
