import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';

@Injectable()
export class ProductBatchRepository {
  constructor(private readonly database: DatabaseService) {}
}
