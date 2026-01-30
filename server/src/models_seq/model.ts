import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  PrimaryKey,
  Default,
  Index,
  ForeignKey, BelongsTo
} from 'sequelize-typescript';
import {Vehicle} from "./vehicle";
import { Brand } from "./brand";

@Table({
  tableName: 'model',
  schema: 'viewer', // change to 'viewer' if that's the correct schema
  timestamps: false,

})
export class VehicleModel extends Model<VehicleModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'model_id', allowNull: true })
  declare model_id?: string;

  @ForeignKey(() => Brand)
  @Column({ type: DataType.UUID, field: 'brand_id', allowNull: true })
  declare brand_id?: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255), field: 'model_name' })
  declare model_name: string;

  //@BelongsTo(() => Brand)
  declare brand: Brand;
  declare vehicle: Vehicle;
}
