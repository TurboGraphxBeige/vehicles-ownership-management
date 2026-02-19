import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  AllowNull,
} from 'sequelize-typescript';

@Table({
  tableName: 'contact',
  schema: 'data',    // change to 'data' if you meant the other snippet
  timestamps: false,
  indexes: [
    {
      name: 'contact_pkey',
      unique: true,
      fields: ['contact_id'],
    },
  ],
})
export class Contact extends Model<Contact> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: true, // keep same as source; consider allowNull: false if primary key required
    field: 'contact_id',
  })
  declare contact_id?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
    field: 'contact_name',
  })
  declare contact_name?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
  })
  declare address?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(20),
  })
  declare telephone?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
  })
  declare email?: string;
}
