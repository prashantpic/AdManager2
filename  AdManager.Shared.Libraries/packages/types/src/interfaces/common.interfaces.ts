export interface IIdentifiable<TID = string> { // Allow string or number for ID
  readonly id: TID;
}

export interface ITimestamped {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ISoftDeletable {
  readonly deletedAt?: Date | null;
}