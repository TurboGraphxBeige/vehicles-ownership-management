import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
} from 'sequelize-typescript';

@Index('vehicle_component_system_id')
@Table({
  tableName: 'vehicle_component_system',
  schema: 'viewer',
  timestamps: false,
})
export class VehicleComponentSystem extends Model<VehicleComponentSystem> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
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
