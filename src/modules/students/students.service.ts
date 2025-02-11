import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Students } from './model/students.model';
import { SuspendedStudent } from './model/suspended-student.model';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Students) private studentsModel: typeof Students,
    @InjectModel(SuspendedStudent) private suspendedStudent: typeof SuspendedStudent,
  ) {}

  async findByEmails(emails: string[]): Promise<Students[]> {
    return this.studentsModel.findAll({
      where: {
        email: emails,
      },
    });
  }

  async findByEmail(email: string): Promise<Students> {
    return this.studentsModel.findOne({
      where: {
        email,
      },
    });
  }

  async findByIds(ids: number[]): Promise<Students[]> {
    return this.studentsModel.findAll({
      where: {
        id: ids,
      },
    });
  }

  async suspendStudent(email: string) {
    const student = await this.studentsModel.findOne({
      where: {
        email,
      },
    });

    if (!student) {
      return;
    }

    const isSuspended = await this.suspendedStudent.findOne({
      where: {
        studentId: student.id,
      },
    });

    if (isSuspended) {
      return {
        student: student.email,
      };
    }

    await this.suspendedStudent.create({
      studentId: student.id,
    });

    return {
      student: student.email,
    };
  }

  async findSuspension(ids: number[]): Promise<SuspendedStudent[]> {
    return this.suspendedStudent.findAll({
      where: {
        studentId: ids,
      },
    });
  }
}
