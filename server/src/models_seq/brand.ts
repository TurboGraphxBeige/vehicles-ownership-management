import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    Unique, HasOne, HasMany
} from 'sequelize-typescript';
import { VehicleModel } from './model'

@Table({
    tableName: 'brand',
    timestamps: false,
    schema: 'viewer'
})

export class Brand extends Model<Brand> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare brand_id: string;

    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare brand_name: string;

    //@HasMany(() => VehicleModel)
    declare models: VehicleModel[];
}