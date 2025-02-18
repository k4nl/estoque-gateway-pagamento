import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';

@Injectable()
export class InventoryRepository {
  constructor(private readonly database: DatabaseService) {}
}
