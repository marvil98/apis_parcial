import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AerolineaEntity } from './aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoAerolineaModule } from './aerolinea-aeropuerto/aerolinea-aeropuerto';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto/aerolinea-aeropuerto.controller';

@Module({
  imports: [
    AerolineaModule,
    AeropuertoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'aeropuerto',
      entities: [AerolineaEntity, AeropuertoEntity],
      dropSchema: true,
      synchronize: true,
    }),
    AeropuertoAerolineaModule,
  ],
  controllers: [AppController, AerolineaAeropuertoController],
  providers: [AppService],
})
export class AppModule {}
