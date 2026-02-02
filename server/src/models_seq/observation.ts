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
import {Vehicle} from "./vehicle.js";
import {VehicleComponent} from "./vehicle_component.js";
import {VehicleComponentSystem} from "./vehicle_component_system.js";
import { Service } from "./service.js";

@Table({
  tableName: 'observation',
  schema: 'viewer',
  timestamps: false,

})
export class Observation extends Model<Observation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  declare observation_id: string;

  @ForeignKey(() => Service) // replace with actual Service model class when available
  @Column({ type: DataType.UUID, allowNull: false })
  declare service_id: string;

  @ForeignKey(() => Vehicle) // replace with actual Vehicle model class when available
  @AllowNull(true)
  @Column({ type: DataType.UUID, allowNull: true })
  declare vehicle_id?: string | null;

  declare vehicle: Vehicle;

  @ForeignKey(() => VehicleComponent) // replace with actual VehicleComponent model class when available
  @AllowNull(true)
  @Column({ type: DataType.UUID, allowNull: true })
  declare vehicle_component_id?: string | null;

  @ForeignKey(() => VehicleComponentSystem) // replace with actual VehicleComponentSystem model class when available
  @AllowNull(true)
  @Column({ type: DataType.UUID, allowNull: true })
  declare vehicle_component_system_id?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare service_date?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.DECIMAL, allowNull: true })
  declare estimated_cost?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.STRING(50), allowNull: true })
  declare priority?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.STRING(50), allowNull: true })
  declare status?: string | null;



}
