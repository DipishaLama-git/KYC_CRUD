import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DistrictsModule } from './district/disrtricts.module';
import { UsersModule } from './users/users.module';
import { ProvincesModule } from './province/provinces.module';
import { MunicipalitiesModule } from './municipality/municipalities.module';
import { KycModule } from './kyc/kyc.module';
 


const DEFAULT_PORTS: Record<string, number> = {
  postgres: 5432,
  mysql: 3306,
};
 
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const type = config.get<'postgres' | 'mysql'>('DB_TYPE', 'postgres');
 
        return {
          type,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', DEFAULT_PORTS[type]),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'postgres'),
          database: config.get<string>('DB_NAME', 'kyc'),
          autoLoadEntities: true,
          synchronize: config.get<string>('NODE_ENV', 'development') !== 'production',
        };
      },
    }),
    UsersModule,
    AuthModule,
    DistrictsModule,
    ProvincesModule,
    MunicipalitiesModule,
    KycModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}