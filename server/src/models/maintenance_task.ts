import {Table, Column, Model, DataType, Index, PrimaryKey, Default, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { Vehicle } from './vehicle.js';
import {VehicleComponent} from "./vehicle_component";
import {VehicleComponentSystem} from "./vehicle_component_system";
import {Brand} from "./brand";
import {Service} from "./service";

@Index('idx_maintenance_task_service_id')
@Index('idx_maintenance_task_vehicle_id')
@Index('idx_maintenance_task_id')

@Table({
  tableName: 'maintenance_task',
  schema: 'data', // or 'viewer' depending on which block you want; original final block used 'data'
  timestamps: false,
})
export class MaintenanceTask extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  declare maintenance_task_id?: string;

  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'service_id',
  })
  service_id?: string;

  @BelongsTo(() => Service)
  declare service: Service;

  @ForeignKey(() => Vehicle)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'vehicle_id',
  })
  vehicle_id?: string;

  @BelongsTo(() => Vehicle)
  declare vehicle: Vehicle;

  @ForeignKey(() => VehicleComponent)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'vehicle_component_id',
  })
  vehicle_component_id?: string;

  @BelongsTo(() => VehicleComponent)
  declare vehicle_component: VehicleComponent;

  @ForeignKey(() => VehicleComponentSystem)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'vehicle_component_system_id',
  })
  vehicle_component_system_id?: string;
  @BelongsTo(() => VehicleComponentSystem)
  declare vehicle_component_system: VehicleComponentSystem;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'description',
  })
  description?: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
    field: 'cost',
  })
  cost?: string; // DECIMAL maps to string in JS/TS to preserve precision

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'maintenance_task_type',
  })
  maintenance_task_type?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  notes?: string;
}
