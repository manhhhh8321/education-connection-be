import { Module } from '@nestjs/common';

import { ConfigModule } from './shared/config/config.module';
import { DatabaseModule } from './database/database.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';

@Module({
  imports: [ConfigModule, DatabaseModule, TeachersModule, StudentsModule],
})
export class AppModule {}
