import {Table, Column, Model, DataType, Index, PrimaryKey, Default} from 'sequelize-typescript';

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

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'service_id',
  })
  service_id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'vehicle_id',
  })
  vehicle_id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'vehicle_component_id',
  })
  vehicle_component_id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'vehicle_component_system_id',
  })
  vehicle_component_system_id?: string;

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
