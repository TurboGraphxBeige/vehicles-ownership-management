import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  PrimaryKey,
  Default,
  Index,
} from 'sequelize-typescript';

@Table({
  tableName: 'photo',
  schema: 'viewer', // change to 'data' if needed
  timestamps: false,
})
export class Photo extends Model<Photo> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    field: 'vehicle_photo_id',
    allowNull: true, // set to false if DB requires NOT NULL
  })
  declare vehicle_photo_id?: string;

  @AllowNull(true)
  @Index // add an index decorator if you need one on vehicle_id
  @Column({
    type: DataType.UUID,
    field: 'vehicle_id',
  })
  declare vehicle_id?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'mimetype',
  })
  declare mimetype?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'original_name',
  })
  declare original_name?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    field: 'description',
  })
  declare description?: string;

  @AllowNull(true)
  @Column({
    type: DataType.BLOB,
    field: 'image',
  })
  declare image?: Buffer;
}
