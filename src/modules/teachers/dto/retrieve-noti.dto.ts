import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class RetrieveNotificationsRequestDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Teacher email must be valid email address' })
  teacher: string;

  @IsNotEmpty()
  @IsString()
  notification: string;
}
