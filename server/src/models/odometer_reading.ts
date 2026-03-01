import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    Unique, HasOne, HasMany, ForeignKey, AllowNull
} from 'sequelize-typescript';
import { VehicleModel } from './model'
import { Vehicle } from "./vehicle";

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


    @ForeignKey(() => Vehicle) // replace with actual Vehicle model class when available
    @AllowNull(true)
    @Column({ type: DataType.UUID, allowNull: true })
    declare vehicle_id?: string | null;

    declare vehicle: Vehicle;
}
