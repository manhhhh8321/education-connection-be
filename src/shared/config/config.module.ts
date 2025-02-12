import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModuleRoot } from '@nestjs/config';

import { ConfigService } from './config.service';

const NestConfigModule = NestConfigModuleRoot.forRoot({
  isGlobal: true,
  ignoreEnvFile: true,
});

@Global()
@Module({
  imports: [NestConfigModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
