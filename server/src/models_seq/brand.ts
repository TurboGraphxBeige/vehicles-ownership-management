import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    Unique, HasOne, HasMany, ForeignKey
} from 'sequelize-typescript';
import { VehicleModel } from './model'

@Table({
    tableName: 'brand',
    timestamps: false,
    schema: 'data'
})

export class Brand extends Model<Brand> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        defaultValue: DataType.UUIDV4
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