import { Table, Column, Model, ForeignKey, CreatedAt, DataType, UpdatedAt } from 'sequelize-typescript';
import { Students } from './students.model';

@Table({
  tableName: 'suspended_students',
  underscored: true,
  timestamps: true,
})
export class SuspendedStudent extends Model<SuspendedStudent> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Students)
  @Column
  studentId: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  updatedAt: Date;
}
