import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Teachers } from '../model/teachers.model';
import { TeachersService } from '../teachers.service';
import { Students } from '../../students/model/students.model';
import { TeacherStudent } from '../model/teacher-student.model';
import { StudentsService } from '../../students/students.service';
import { SuspendedStudent } from '../../students/model/suspended-student.model';

describe('TeachersService', () => {
  let service: TeachersService;
  let teachersModel: typeof Teachers;
  let teacherStudentModel: typeof TeacherStudent;
  let studentService: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
        {
          provide: getModelToken(Teachers),
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: getModelToken(TeacherStudent),
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            bulkCreate: jest.fn(),
          },
        },
        {
          provide: StudentsService,
          useValue: {
            findByEmails: jest.fn(),
            findByIds: jest.fn(),
            findByEmail: jest.fn(),
            suspendStudent: jest.fn(),
            findSuspension: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TeachersService>(TeachersService);
    teachersModel = module.get<typeof Teachers>(getModelToken(Teachers));
    teacherStudentModel = module.get<typeof TeacherStudent>(getModelToken(TeacherStudent));
    studentService = module.get<StudentsService>(StudentsService);
  });

  describe('registerStudents', () => {
    it('should throw an error if teacher is not found', async () => {
      jest.spyOn(teachersModel, 'findOne').mockResolvedValue(null);

      await expect(
        service.registerStudents({ teacher: 'teacher@gmail.com', students: ['student@gmail.com'] }),
      ).rejects.toThrowError('Teacher email not found');
    });

    it('should throw an error if student email is not found', async () => {
      jest.spyOn(teachersModel, 'findOne').mockResolvedValue({
        id: 1,
        email: 'teacher@gmail.com',
      } as Teachers);
      jest.spyOn(studentService, 'findByEmails').mockResolvedValue([]);

      await expect(
        service.registerStudents({ teacher: 'teacher@gmail.com', students: ['student@gmail.com'] }),
      ).rejects.toThrowError('Some students email not found');
    });

    it('should throw an error if a student is already registered', async () => {
      jest.spyOn(teachersModel, 'findOne').mockResolvedValue({
        id: 1,
        email: 'teacher@gmail.com',
      } as Teachers);

      jest
        .spyOn(studentService, 'findByEmails')
        .mockResolvedValue([{ id: 1, email: 'student@gmail.com' }] as Students[]);

      jest
        .spyOn(teacherStudentModel, 'findAll')
        .mockResolvedValue([{ teacherId: 1, studentId: 1 }] as TeacherStudent[]);

      await expect(
        service.registerStudents({ teacher: 'teacher@gmail.com', students: ['student@gmail.com'] }),
      ).rejects.toThrowError('One or more students are already registered under this teacher');
    });

    it('should register students successfully', async () => {
      jest.spyOn(teachersModel, 'findOne').mockResolvedValue({
        id: 1,
        email: 'teacher@gmail.com',
      } as Teachers);

      jest
        .spyOn(studentService, 'findByEmails')
        .mockResolvedValue([{ id: 1, email: 'student@gmail.com' }] as Students[]);

      jest.spyOn(teacherStudentModel, 'findAll').mockResolvedValue([]);

      jest
        .spyOn(teacherStudentModel, 'bulkCreate')
        .mockResolvedValue([{ teacherId: 1, studentId: 1 }] as TeacherStudent[]);

      const result = await service.registerStudents({
        teacher: 'teacher@gmail.com',
        students: ['student@gmail.com'],
      });

      expect(result).toEqual({
        message: 'Successfully registered students',
        teacher: 'teacher@gmail.com',
        students: ['student@gmail.com'],
      });
    });
  });

  describe('getCommonStudents', () => {
    it('should throw an error if some teachers are not found', async () => {
      jest.spyOn(teachersModel, 'findAll').mockResolvedValue([{ id: 1, email: 'teacher1@gmail.com' }] as Teachers[]);

      await expect(service.getCommonStudents(['teacher1@gmail.com', 'teacher2@gmail.com'])).rejects.toThrowError(
        'Some teachers email not found',
      );
    });

    it('should return common students', async () => {
      jest.spyOn(teachersModel, 'findAll').mockResolvedValue([
        { id: 1, email: 'teacher1@gmail.com' },
        { id: 2, email: 'teacher2@gmail.com' },
      ] as Teachers[]);

      jest
        .spyOn(teacherStudentModel, 'findAll')
        .mockResolvedValue([{ studentId: 1 }, { studentId: 2 }] as TeacherStudent[]);

      jest.spyOn(studentService, 'findByIds').mockResolvedValue([
        { id: 1, email: 'student1@gmail.com' },
        { id: 2, email: 'student2@gmail.com' },
      ] as Students[]);

      const result = await service.getCommonStudents(['teacher1@gmail.com', 'teacher2@gmail.com']);
      expect(result).toEqual({ students: ['student1@gmail.com', 'student2@gmail.com'] });
    });
  });

  describe('suspendStudent', () => {
    it('should throw an error if student is not found', async () => {
      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(null);

      await expect(service.suspendStudent({ student: 'student@gmail.com' })).rejects.toThrowError(
        'Student email not found',
      );
    });

    it('should suspend student successfully', async () => {
      jest.spyOn(studentService, 'findByEmail').mockResolvedValue({ email: 'student@gmail.com' } as Students);
      jest.spyOn(studentService, 'suspendStudent').mockResolvedValue(undefined);

      const result = await service.suspendStudent({ student: 'student@gmail.com' });

      expect(result).toEqual({
        student: 'student@gmail.com',
        suspended: true,
      });
    });
  });

  describe('retrieveForNotifications', () => {
    it('should throw an error if teacher is not found', async () => {
      jest.spyOn(teachersModel, 'findOne').mockResolvedValue(null);

      await expect(
        service.retrieveForNotifications({ teacher: 'teacher@gmail.com', notification: 'Hello @student@gmail.com' }),
      ).rejects.toThrowError('Teacher email not found');
    });

    it('should return students who are not suspended', async () => {
      jest.spyOn(teachersModel, 'findOne').mockResolvedValue({
        id: 1,
        email: 'teacher@gmail.com',
        teacherStudents: [{ studentId: 1 }],
      } as Teachers);

      jest
        .spyOn(studentService, 'findByEmails')
        .mockResolvedValue([{ id: 2, email: 'student2@gmail.com' }] as Students[]);
      jest.spyOn(studentService, 'findSuspension').mockResolvedValue([{ studentId: 2 }] as SuspendedStudent[]);
      jest.spyOn(studentService, 'findByIds').mockResolvedValue([{ id: 1, email: 'student1@gmail.com' }] as Students[]);

      const result = await service.retrieveForNotifications({
        teacher: 'teacher@gmail.com',
        notification: 'Hello @student2@gmail.com',
      });

      expect(result).toEqual({ recipients: ['student1@gmail.com'] });
    });
  });
});
