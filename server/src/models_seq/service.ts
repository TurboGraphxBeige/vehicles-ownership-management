import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  AllowNull,
  Index,
} from 'sequelize-typescript';
import { Vehicle } from "./vehicle.js";
import { Contact } from "./contact.js";

@Table({
  tableName: 'service',
  schema: 'viewer',
  timestamps: false,
  indexes: [
    { name: 'idx_service_contact_id', fields: ['contact_id'] },
    { name: 'idx_service_vehicle_id', fields: ['vehicle_id'] },
    { name: 'service_pkey', unique: true, fields: ['service_id'] },
  ],
})
export class Service extends Model<Service> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: true })
  declare service_id?: string | null;

  @ForeignKey(() => Vehicle) // replace with actual Vehicle model when available
  @AllowNull(true)
  @Column({ type: DataType.UUID, allowNull: true })
  declare vehicle_id?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare service_date?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.TEXT, allowNull: true })
  declare service_request_description?: string | null;

  @ForeignKey(() => Contact) // replace with actual Contact model when available
  @AllowNull(true)
  @Column({ type: DataType.UUID, allowNull: true })
  declare contact_id?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.DECIMAL, allowNull: true })
  declare total_cost?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.STRING(255), allowNull: true })
  declare invoice?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string | null;


}
