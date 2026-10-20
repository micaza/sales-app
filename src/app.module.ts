import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SalesEventsModule } from './sales-events/sales-events.module';
import { StoresModule } from './stores/stores.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // this reads .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,// tables come from db/schema.sql, never autochange
      }),
    }), SalesEventsModule, StoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
