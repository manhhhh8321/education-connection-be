import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Students } from './model/students.model';
import { StudentsService } from './students.service';
import { SuspendedStudent } from './model/suspended-student.model';

@Module({
  imports: [SequelizeModule.forFeature([Students, SuspendedStudent])],
  controllers: [],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
