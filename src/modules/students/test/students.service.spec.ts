import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Students } from '../model/students.model';
import { SuspendedStudent } from '../model/suspended-student.model';
import { StudentsService } from '../students.service';

const mockStudents = [
  { id: 1, email: 'student1@example.com' },
  { id: 2, email: 'student2@example.com' },
];

const mockSuspendedStudent = [{ studentId: 1 }];

const studentsModelMock = {
  findAll: jest.fn().mockImplementation(({ where }) => {
    return mockStudents.filter((s) => where.email.includes(s.email));
  }),
  findOne: jest.fn().mockImplementation(({ where }) => {
    return mockStudents.find((s) => s.email === where.email) || null;
  }),
};

const suspendedStudentModelMock = {
  findAll: jest.fn().mockResolvedValue(mockSuspendedStudent),
  findOne: jest.fn().mockImplementation(({ where }) => {
    return mockSuspendedStudent.find((s) => s.studentId === where.studentId) || null;
  }),
  create: jest.fn().mockResolvedValue(null),
};

describe('StudentsService', () => {
  let studentsService: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getModelToken(Students),
          useValue: studentsModelMock,
        },
        {
          provide: getModelToken(SuspendedStudent),
          useValue: suspendedStudentModelMock,
        },
      ],
    }).compile();

    studentsService = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(studentsService).toBeDefined();
  });

  it('should suspend student', async () => {
    const result = await studentsService.suspendStudent('student1@example.com');
    expect(result).toEqual({ student: 'student1@example.com' });
  });

  it('should return existing suspension if already suspended', async () => {
    const result = await studentsService.suspendStudent('student1@example.com');
    expect(result).toEqual({ student: 'student1@example.com' });
  });

  it('should find suspensions', async () => {
    const result = await studentsService.findSuspension([1]);
    expect(result).toEqual(mockSuspendedStudent);
  });
});
