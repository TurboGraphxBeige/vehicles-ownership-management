import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

@Index('idx_maintenance_task_service_id')
@Index('idx_maintenance_task_vehicle_id')
@Index('idx_maintenance_task_id')

@Table({
  tableName: 'maintenance_task',
  schema: 'viewer', // or 'viewer' depending on which block you want; original final block used 'data'
  timestamps: false,
})
export class MaintenanceTask extends Model<MaintenanceTask> {
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'maintenance_task_id',
  })
  maintenanceTaskId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'service_id',
  })
  serviceId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'vehicle_id',
  })
  vehicleId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'vehicle_component_id',
  })
  vehicleComponentId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'vehicle_component_system_id',
  })
  vehicleComponentSystemId?: string;

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
  maintenanceTaskType?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  notes?: string;
}
