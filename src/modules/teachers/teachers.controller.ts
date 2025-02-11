import { Body, Controller, Get, HttpCode, HttpStatus, ParseArrayPipe, Post, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { IRetrieveNotificationsResponse } from 'src/interfaces/response.interface';
import {
  RegisterStudentsRequestDto,
  SuspendStudentRequestDto,
  RetrieveNotificationsRequestDto,
} from './dto/teacher.dto';

@Controller('')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post('/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerStudents(@Body() registerStudentDto: RegisterStudentsRequestDto) {
    await this.teachersService.registerStudents(registerStudentDto);
  }

  @Get('/commonstudents')
  async getCommonStudents(@Query('teacher', new ParseArrayPipe({ items: String })) teacherEmails: string[]) {
    return this.teachersService.getCommonStudents(teacherEmails);
  }

  @Post('/suspend')
  @HttpCode(HttpStatus.NO_CONTENT)
  async suspendStudent(@Body() suspendStudentDto: SuspendStudentRequestDto) {
    return this.teachersService.suspendStudent(suspendStudentDto);
  }

  @Post('/retrievefornotifications')
  @HttpCode(HttpStatus.OK)
  async retrieveForNotifications(
    @Body() retrieveNotificationsDto: RetrieveNotificationsRequestDto,
  ): Promise<IRetrieveNotificationsResponse> {
    return this.teachersService.retrieveForNotifications(retrieveNotificationsDto);
  }
}
