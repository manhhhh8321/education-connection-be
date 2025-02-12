import { Test, TestingModule } from '@nestjs/testing';
import { IRetrieveNotificationsResponse } from 'src/interfaces/response.interface';
import { RegisterStudentsRequestDto } from '../dto/register-students.dto';
import { RetrieveNotificationsRequestDto } from '../dto/retrieve-noti.dto';
import { SuspendStudentRequestDto } from '../dto/suspend-student.dto';
import { TeachersController } from '../teachers.controller';
import { TeachersService } from '../teachers.service';

describe('TeachersController', () => {
  let teachersController: TeachersController;
  let teachersService: TeachersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
      providers: [
        {
          provide: TeachersService,
          useValue: {
            registerStudents: jest.fn(),
            getCommonStudents: jest.fn(),
            suspendStudent: jest.fn(),
            retrieveForNotifications: jest.fn(),
          },
        },
      ],
    }).compile();

    teachersController = module.get<TeachersController>(TeachersController);
    teachersService = module.get<TeachersService>(TeachersService);
  });

  it('should be defined', () => {
    expect(teachersController).toBeDefined();
  });

  describe('registerStudents', () => {
    it('should call registerStudents service method', async () => {
      const dto: RegisterStudentsRequestDto = { teacher: 'teacher@example.com', students: ['student1@example.com'] };
      await teachersController.registerStudents(dto);
      expect(teachersService.registerStudents).toHaveBeenCalledWith(dto);
    });
  });

  describe('getCommonStudents', () => {
    it('should return common students', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
      const mockStudents = ['student1@example.com', 'student2@example.com'];
      jest.spyOn(teachersService, 'getCommonStudents').mockResolvedValue({
        students: mockStudents,
      });

      const result = await teachersController.getCommonStudents(teacherEmails);
      expect(result).toEqual({
        students: mockStudents,
      });
      expect(teachersService.getCommonStudents).toHaveBeenCalledWith(teacherEmails);
    });
  });

  describe('suspendStudent', () => {
    it('should call suspendStudent service method', async () => {
      const dto: SuspendStudentRequestDto = { student: 'student@example.com' };
      await teachersController.suspendStudent(dto);
      expect(teachersService.suspendStudent).toHaveBeenCalledWith(dto);
    });
  });

  describe('retrieveForNotifications', () => {
    it('should return notification recipients', async () => {
      const dto: RetrieveNotificationsRequestDto = { teacher: 'teacher@example.com', notification: 'Hello @student1@example.com' };
      const mockResponse: IRetrieveNotificationsResponse = { recipients: ['student1@example.com', 'student2@example.com'] };
      jest.spyOn(teachersService, 'retrieveForNotifications').mockResolvedValue(mockResponse);

      const result = await teachersController.retrieveForNotifications(dto);
      expect(result).toEqual(mockResponse);
      expect(teachersService.retrieveForNotifications).toHaveBeenCalledWith(dto);
    });
  });
});
