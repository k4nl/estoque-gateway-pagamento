import { DatabaseTrigger } from './trigger.enum';

export class InventoryTrigger {
  static getLowStockTriggerSQL() {
    return `
      CREATE OR REPLACE FUNCTION notify_low_stock() RETURNS TRIGGER AS $$
      DECLARE 
        payload TEXT;
      BEGIN
        IF NEW.alert_on_low_stock = TRUE AND NEW.quantity <= COALESCE(NEW.minimum_stock, 0) THEN
          payload := json_build_object(
            'type', '${DatabaseTrigger.low_stock}',  -- Tipo da notificação
            'id', NEW.id,
            'product_id', NEW.product_id,
            'quantity', NEW.quantity,
            'minimum_stock', NEW.minimum_stock,
            'alert_on_low_stock', NEW.alert_on_low_stock
          )::TEXT;

          PERFORM pg_notify('inventory_notifications', payload);
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS ${DatabaseTrigger.low_stock} ON "Inventory";

      CREATE TRIGGER ${DatabaseTrigger.low_stock}
      AFTER UPDATE ON "Inventory"
      FOR EACH ROW
      WHEN (NEW.quantity <= COALESCE(NEW.minimum_stock, 0) AND NEW.alert_on_low_stock = TRUE)
      EXECUTE FUNCTION notify_low_stock();
    `;
  }
}
