import { Table, Column, Model, HasMany, Unique, CreatedAt, DataType, UpdatedAt } from 'sequelize-typescript';
import { TeacherStudent } from './teacher-student.model';

@Table({ tableName: 'teachers', underscored: true, timestamps: true })
export class Teachers extends Model<Teachers> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Unique
  @Column
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
