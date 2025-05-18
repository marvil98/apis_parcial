import { Module } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity/aerolinea.entity';

@Module({
  providers: [AerolineaAeropuertoService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity])],
})
export class AeropuertoAerolineaModule {}
