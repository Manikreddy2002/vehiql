-- DropForeignKey
ALTER TABLE "TestDriveBooking" DROP CONSTRAINT "TestDriveBooking_carId_fkey";

-- AddForeignKey
ALTER TABLE "TestDriveBooking" ADD CONSTRAINT "TestDriveBooking_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
