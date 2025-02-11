import { Table, Unique, Column, HasMany, Model, CreatedAt, DataType, UpdatedAt } from 'sequelize-typescript';
import { TeacherStudent } from '../../teachers/model/teacher-student.model';

@Table({
  tableName: 'students',
  underscored: true,
  timestamps: true,
})
export class Students extends Model<Students> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @HasMany(() => TeacherStudent)
  teacherStudents: TeacherStudent[];

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
