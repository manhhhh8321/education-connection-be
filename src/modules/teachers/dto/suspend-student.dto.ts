import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SuspendStudentRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Student email must be valid email address' })
  student: string;
}
