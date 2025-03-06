import { ProductBatch as ProductBatchModel } from '@prisma/client';
import { ProductBatch as ProductBatchDomain } from 'src/@core/domain/product-batch/product-batch.domain';
import { Uuid } from 'src/@core/value-object';

export class ProductBatchMapper {
  public static toDatabase(
    productBatchDomain: ProductBatchDomain,
  ): ProductBatchModel {
    return {
      id: productBatchDomain.getId(),
      quantity: productBatchDomain.getQuantity(),
      expiration_date: productBatchDomain.getExpirationDate(),
      product_id: productBatchDomain.getProductId(),
      created_at: productBatchDomain.getCreatedAt(),
      updated_at: productBatchDomain.getUpdatedAt(),
    };
  }

  public static toDomain(
    productBatchModel: ProductBatchModel,
  ): ProductBatchDomain {
    return new ProductBatchDomain({
      id: productBatchModel.id,
      quantity: productBatchModel.quantity,
      expiration_date: productBatchModel.expiration_date,
      created_at: productBatchModel.created_at,
      updated_at: productBatchModel.updated_at,
      product_id: new Uuid(productBatchModel.product_id),
    });
  }
}
