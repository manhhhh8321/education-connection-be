import { ArrayNotEmpty, ArrayUnique, IsEmail, IsArray } from 'class-validator';

export class RegisterStudentsRequestDto {
  @IsEmail({}, { each: true, message: 'Student emails must be valid email addresses' })
  @IsArray()
  @ArrayNotEmpty({
    message: 'Student emails is required',
  })
  @ArrayUnique({
    message: 'Student emails must be unique',
  })
  students: string[];

  @IsEmail(
    {},
    {
      message: 'Teacher email must be valid email address',
    },
  )
  teacher: string;
}
