import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { Students } from '../../students/model/students.model';
import { Teachers } from '../../teachers/model/teachers.model';

@Table({
  tableName: 'teacher_students',
  timestamps: true,
  underscored: true,
})
export class TeacherStudent extends Model<TeacherStudent> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Teachers)
  @Column
  teacherId: number;

  @ForeignKey(() => Students)
  @Column
  studentId: number;

  @BelongsTo(() => Teachers)
  teacher: Teachers;

  @BelongsTo(() => Students)
  student: Students;

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
