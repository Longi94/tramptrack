export interface Availabilities {
  products?: Product[];
}

export interface Product {
  description?: string;
  imageUrl?: string;
  name?: string;
  sessions?: Session[];
  shortDescription?: string;
}

export interface Session {
  bookedQuantity?: number;
  dateIndex?: number;
  endTime?: number;
  startTime?: number;
  sessionId?: number;
  productLocationCapacity?: number;
  productId?: number;
  productBookedQuantityConsideringLocation?: number;
  name?: string;
  isSessionCapacityFull?: boolean;
  isRestricted?: boolean;
}
