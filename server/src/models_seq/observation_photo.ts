import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  Default,
  Index,
} from 'sequelize-typescript';
import { Observation } from './observation';

@Index('idx_observation_photo_observation_id')
@Index('idx_observation_photo_id')
@Table({
  tableName: 'observation_photo',
  schema: 'viewer',
  timestamps: false,
})
export class ObservationPhoto extends Model<ObservationPhoto> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'observation_photo_id',
  })
  observationPhotoId!: string;

  @ForeignKey(() => Observation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'observation_id',
  })
  observationId!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'mimetype',
  })
  mimetype?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'original_name',
  })
  originalName?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'description',
  })
  description?: string;

  @Column({
    type: DataType.BLOB,
    allowNull: true,
    field: 'image',
  })
  image?: Buffer;
}
