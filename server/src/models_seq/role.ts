import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
} from 'sequelize-typescript';


@Table({
  tableName: 'role',
  timestamps: false,
  schema: 'viewer'
})

export class Role extends Model<Role> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare role_id: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare role_name: string;

}