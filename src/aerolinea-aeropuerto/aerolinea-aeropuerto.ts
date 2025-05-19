import { Module } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])
  ],
  providers: [AerolineaAeropuertoService],
  exports: [AerolineaAeropuertoService]
})
export class AeropuertoAerolineaModule {}
