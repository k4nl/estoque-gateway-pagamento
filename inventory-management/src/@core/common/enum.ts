export enum ReservationType {
  RESERVABLE = 'reservable',
  NON_RESERVABLE = 'non_reservable',
}

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ReservationStatus {
  RELEASED = 'released',
  RESERVED = 'reserved',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}

export enum UpdateQuantityBatchEnum {
  INCREMENT = 'increment',
  DECREMENT = 'decrement',
}
