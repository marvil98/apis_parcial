import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from '../../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from '../../aeropuerto/aeropuerto.entity/aeropuerto.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [AerolineaEntity, AeropuertoEntity],
   synchronize: true,
 }),
 TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity]),
];