import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Teachers } from './model/teachers.model';
import { StudentsService } from '../students/students.service';
import { TeacherStudent } from './model/teacher-student.model';
import {
  RegisterStudentsRequestDto,
  RetrieveNotificationsRequestDto,
  SuspendStudentRequestDto,
} from './dto/teacher.dto';
import { ErrorHelper } from '../../helpers/error.utils';
import { extractMentionedStudents } from '../../utils/common';
import { IRetrieveNotificationsResponse, ISuspendStudentResponse } from 'src/interfaces/response.interface';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teachers) private teachersModel: typeof Teachers,
    @InjectModel(TeacherStudent) private teacherStudentModel: typeof TeacherStudent,
    private readonly studentService: StudentsService,
  ) {}

  async registerStudents(registerStudentDto: RegisterStudentsRequestDto) {
    const { teacher: teacherEmail, students: studentEmails } = registerStudentDto;

    // 1. Find teacher by email
    const teacher = await this.teachersModel.findOne({
      where: { email: teacherEmail },
    });

    if (!teacher) {
      ErrorHelper.BadRequestException('Teacher email not found');
    }

    // 2. Find students by email
    const students = await this.studentService.findByEmails(studentEmails);
    if (students.length !== studentEmails.length) {
      ErrorHelper.BadRequestException('Some students email not found');
    }

    // 3. Check if any student is already registered
    const studentIds = students.map((student) => student.id);
    const existingRegistrations = await this.teacherStudentModel.findAll({
      where: {
        teacherId: teacher.id,
        studentId: studentIds,
      },
    });

    if (existingRegistrations.length > 0) {
      ErrorHelper.BadRequestException('One or more students are already registered under this teacher');
    }

    // 4. Register students
    const teacherStudents = students.map((student) => ({
      teacherId: teacher.id,
      studentId: student.id,
    }));

    await this.teacherStudentModel.bulkCreate(teacherStudents);

    return {
      message: 'Successfully registered students',
      teacher: teacher.email,
      students: students.map((student) => student.email),
    };
  }

  async getCommonStudents(teacherEmails: string[]) {
    // 1. Find teachers by email
    const teachers = await this.teachersModel.findAll({
      where: {
        email: teacherEmails,
      },
    });

    if (teachers.length !== teacherEmails.length) {
      ErrorHelper.BadRequestException('Some teachers email not found');
    }

    const teacherIds = teachers.map((teacher) => teacher.id);

    // 2. Find students by teacherId
    const teacherStudents = await this.teacherStudentModel.findAll({
      where: {
        teacherId: teacherIds,
      },
    });

    const studentIds = teacherStudents.map((teacherStudent) => teacherStudent.studentId);

    const students = await this.studentService.findByIds(studentIds);

    return {
      students: [...new Set(students.map((student) => student.email))],
    };
  }

  async suspendStudent(suspendStudentDto: SuspendStudentRequestDto): Promise<ISuspendStudentResponse> {
    const { student: studentEmail } = suspendStudentDto;
    const student = await this.studentService.findByEmail(studentEmail);

    if (!student) {
      ErrorHelper.BadRequestException('Student email not found');
    }

    await this.studentService.suspendStudent(studentEmail);

    return {
      student: student.email,
      suspended: true,
    };
  }

  async retrieveForNotifications(
    retrieveNotificationsDto: RetrieveNotificationsRequestDto,
  ): Promise<IRetrieveNotificationsResponse> {
    const { teacher: teacherEmail, notification } = retrieveNotificationsDto;

    // 1. Find teacher and related students in one query
    const teacher = await this.teachersModel.findOne({
      where: { email: teacherEmail },
      include: [{ model: this.teacherStudentModel, attributes: ['studentId'] }],
    });

    if (!teacher) {
      throw ErrorHelper.BadRequestException('Teacher email not found');
    }

    // Extract student IDs directly from the relation
    const studentIds = teacher.teacherStudents?.map((ts) => ts.studentId);

    // 2. Get mentioned students from notification (if any)
    const mentionedStudents = extractMentionedStudents(notification);
    const mentionedStudentInfos = mentionedStudents.length
      ? await this.studentService.findByEmails(mentionedStudents)
      : [];

    const mentionedStudentIds = mentionedStudentInfos.map((student) => student.id);
    const allStudentIds = Array.from(new Set([...studentIds, ...mentionedStudentIds])); // Remove duplicates

    if (allStudentIds.length === 0) return { recipients: [] };

    // 3. Find suspended students in one query
    const suspendedStudentIds = new Set(
      (await this.studentService.findSuspension(allStudentIds)).map((s) => s.studentId),
    );

    // 4. Filter out suspended students and retrieve emails in one query
    const validStudents = await this.studentService.findByIds(
      allStudentIds.filter((id) => !suspendedStudentIds.has(id)),
    );

    return { recipients: validStudents.map((student) => student.email) };
  }
}
