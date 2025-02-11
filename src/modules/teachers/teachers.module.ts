import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Teachers } from './model/teachers.model';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { TeacherStudent } from './model/teacher-student.model';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [SequelizeModule.forFeature([Teachers, TeacherStudent]), StudentsModule],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
