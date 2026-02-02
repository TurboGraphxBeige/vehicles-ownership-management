import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  Index,
} from 'sequelize-typescript';
import { VehicleComponentSystem } from './vehicle_component_system.js'; // adjust path as needed

@Index( 'idx_vehicle_component_system_id')
@Index( 'idx_vehicle_component_id')
@Table({
  tableName: 'vehicle_component',
  schema: 'viewer',
  timestamps: false,
})
export class VehicleComponent extends Model<VehicleComponent> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'vehicle_component_id',
  })
  vehicleComponentId!: string;

  @ForeignKey(() => VehicleComponentSystem)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'vehicle_component_system_id',
  })
  vehicleComponentSystemId!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'name',
  })
  name!: string;
}
