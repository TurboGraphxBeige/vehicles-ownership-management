import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  PrimaryKey,
  Default,
  Index, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Vehicle} from "./vehicle.js";

@Table({
  tableName: 'vehicle_photo',
  schema: 'data', // change to 'data' if you want that schema instead
  timestamps: false,
  indexes: [
    {
      name: 'idx_vehicle_photo_vehicle_id',
      fields: ['vehicle_id'],
    },
    {
      name: 'vehicle_photo_pkey',
      unique: true,
      fields: ['vehicle_photo_id'],
    },
  ],
})
export class VehiclePhoto extends Model<VehiclePhoto> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    field: 'vehicle_photo_id',
    allowNull: true, // keep as original; set false if primary key should be required
  })
  declare vehicle_photo_id?: string;


  @AllowNull(true)
  @ForeignKey(() => Vehicle)
  @Index('idx_vehicle_photo_vehicle_id')
  @Column({
    type: DataType.UUID,
    field: 'vehicle_id',
  })
  declare vehicle_id?: string;


  declare vehicle: Vehicle;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'mimetype',
  })
  declare mimetype?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'original_name',
  })
  declare original_name?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    field: 'description',
  })
  declare description?: string;

  @AllowNull(true)
  @Column({
    type: DataType.BLOB,
    field: 'image',
  })
  declare image?: Buffer;
}
