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
    tableName: 'odometer_reading',
    timestamps: true,
    schema: 'data'
})

export class OdometerReading extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        defaultValue: DataType.UUIDV4
    })
    declare odometer_reading_id: string;

    @Unique
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare reading: number;


    declare models: VehicleModel[];
}