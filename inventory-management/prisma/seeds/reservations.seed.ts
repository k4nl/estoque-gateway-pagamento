import { ReservationStatus } from '@prisma/client';
import { BaseSeed, SeedRunner } from './seed';
import { v4 as uuidv4 } from 'uuid';

export class CategoySeed extends BaseSeed implements SeedRunner {
  async run(): Promise<void> {
    const [reservations, batches] = await Promise.all([
      this.database.productReservation.findMany(),
      this.database.productBatch.findMany(),
    ]);

    if (reservations.length) {
      return;
    }

    if (!batches.length) {
      throw new Error('No batches found');
    }

    const newReservations = [];

    for (const batch of batches) {
      const random_date = new Date();
      // expires at between 0 and 5 minutes

      random_date.setMinutes(
        random_date.getMinutes() + Math.floor(Math.random() * 5),
      );

      const reservationStatus = Object.values(ReservationStatus);

      const randomStatus =
        reservationStatus[Math.floor(Math.random() * reservationStatus.length)];

      newReservations.push({
        id: uuidv4().toString(),
        product_id: batch.product_id,
        batch_id: batch.id,
        external_id: uuidv4().toString(),
        quantity: Math.floor(Math.random() * 2),
        status: randomStatus,
        expires_at: random_date,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await this.database.productReservation.createMany({
      data: newReservations,
    });
  }
}
