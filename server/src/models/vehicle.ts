import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  PrimaryKey,
  Default,
  ForeignKey,
  Index, HasMany
} from 'sequelize-typescript';
import { Contact } from './contact.js';
import { User } from './user.js';
import { VehicleModel } from './model.js';
import {VehiclePhoto} from "./vehicle_photo.js"; // if you have a model table named vehicle-model
import { Observation } from "./observation.js";
import { Service} from "./service.js";
import {OdometerReading} from "./odometer_reading.js";

@Table({
  tableName: 'vehicle',
  schema: 'data', // change to 'data' if that is the correct schema
  timestamps: false,
  indexes: [
    { name: 'idx_vehicle_contact_id', fields: ['contact_id'] },
    { name: 'idx_vehicle_model_id', fields: ['model_id'] },
    { name: 'idx_vehicle_user_id', fields: ['user_id'] },
    { name: 'vehicle_pkey', unique: true, fields: ['vehicle_id'] },
  ],
})
export class Vehicle extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'vehicle_id', allowNull: true })
  declare vehicle_id?: string;

  //@ForeignKey(() => VehicleModel)
  //@Index('idx_vehicle_model_id')
  //@Column({ type: DataType.UUID, field: 'model_id', allowNull: true })
  //declare model_id?: string;

  @Column({ type: DataType.INTEGER, field: 'making_year', allowNull: true })
  declare making_year?: number;

  @Column({ type: DataType.DATEONLY, field: 'purchase_date', allowNull: true })
  declare purchase_date?: string;

  @Column({ type: DataType.DECIMAL, field: 'price_paid', allowNull: true })
  declare price_paid?: string;

  @Column({ type: DataType.BLOB, field: 'invoice', allowNull: true })
  declare invoice?: Buffer;

  @ForeignKey(() => VehiclePhoto)
  @Column({ type: DataType.UUID, field: 'main_picture', allowNull: true })
  declare main_picture?: string;

  @ForeignKey(() => User)
  @Index('idx_vehicle_user_id')
  @Column({ type: DataType.UUID, field: 'user_id', allowNull: true })
  declare user_id?: string;

  @ForeignKey(() => Contact)
  @Index('idx_vehicle_contact_id')
  @Column({ type: DataType.UUID, field: 'contact_id', allowNull: true })
  declare contact_id?: string;

  @ForeignKey(() => VehicleModel)
  @Index('idx_vehicle_model_id')
  @Column({ type: DataType.UUID, field: 'model_id', allowNull: true })
  declare model_id?: string;

  declare photos: VehiclePhoto[];
  declare services: Service[];
  declare observations: Observation[];
  declare odometer_readings: OdometerReading[];
  declare model: VehicleModel;
  declare user: User;

}
