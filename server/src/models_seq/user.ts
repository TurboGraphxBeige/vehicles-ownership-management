import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  PrimaryKey,
  Default,
  ForeignKey,
  Index,
  Unique,
} from 'sequelize-typescript';
import { Role } from './role';
import { Vehicle } from "./vehicle";

@Table({
  tableName: 'user',
  schema: 'viewer', // use 'viewer' or 'data' depending on your DB
  timestamps: false,
  indexes: [
    { name: 'idx_user_role_id', fields: ['role_id'] },
    { name: 'user_pkey', unique: true, fields: ['user_id'] },
    { name: 'user_username_key', unique: true, fields: ['username'] },
  ],
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'user_id', allowNull: true })
  declare user_id?: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(255), field: 'first_name' })
  declare first_name?: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(255), field: 'last_name' })
  declare last_name?: string;

  @AllowNull(true)
  @Unique
  @Index('user_username_key')
  @Column({ type: DataType.STRING(255), field: 'username' })
  declare username?: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(255), field: 'password' })
  declare password?: string;

  @ForeignKey(() => Role)
  @Index('idx_user_role_id')
  @Column({ type: DataType.UUID, field: 'role_id', allowNull: true })
  declare role_id?: string;

  declare vehicle: Vehicle;
}
