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
import { Contact } from "./contact.js";
import { Vehicle } from "./vehicle.js";

@Table({
  tableName: 'service',
  schema: 'viewer',
  timestamps: false,
})

export class Service extends Model<Service> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  declare service_id?: string;

  @ForeignKey(() => Vehicle) // replace with actual Vehicle model class when available
  @AllowNull(true)
  @Column({ type: DataType.UUID, allowNull: true })
  declare vehicle_id?: string | null;

  declare vehicle: Vehicle;

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
