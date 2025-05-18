import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,
    
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
      ) {}
    
      async addAirportToAirline(aerolineaId: string, aeropuertoId: string): Promise<AerolineaEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
        if (!aeropuerto)
          throw new BusinessLogicException('The airport with the given id was not found', BusinessError.NOT_FOUND);
    
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
          throw new BusinessLogicException('The airline with the given id was not found', BusinessError.NOT_FOUND);
    
        aerolinea.aeropuertos.push(aeropuerto);
        return await this.aerolineaRepository.save(aerolinea);
      }
    
      async findAirportsFromAirline(aerolineaId: string): Promise<AeropuertoEntity[]> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
          throw new BusinessLogicException('The airline with the given id was not found', BusinessError.NOT_FOUND);
        return aerolinea.aeropuertos;
      }
    
      async findAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
          throw new BusinessLogicException('The airline with the given id was not found', BusinessError.NOT_FOUND);
    
        const aeropuerto = aerolinea.aeropuertos.find(e => e.id === aeropuertoId);
        if (!aeropuerto)
          throw new BusinessLogicException('The airport with the given id is not associated to the airline', BusinessError.PRECONDITION_FAILED);
    
        return aeropuerto;
      }
    
      async updateAirportsFromAirline(aerolineaId: string, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
          throw new BusinessLogicException('The airline with the given id was not found', BusinessError.NOT_FOUND);
    
        for (const aeropuerto of aeropuertos) {
          const exists = await this.aeropuertoRepository.findOne({ where: { id: aeropuerto.id } });
          if (!exists)
            throw new BusinessLogicException('The airport with the given id was not found', BusinessError.NOT_FOUND);
        }
    
        aerolinea.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolinea);
      }
    
      async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<void> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: aerolineaId }, relations: ['aeropuertos'] });
        if (!aerolinea)
          throw new BusinessLogicException('The airline with the given id was not found', BusinessError.NOT_FOUND);
    
        const aeropuerto = aerolinea.aeropuertos.find(e => e.id === aeropuertoId);
        if (!aeropuerto)
          throw new BusinessLogicException('The airport with the given id is not associated to the airline', BusinessError.PRECONDITION_FAILED);
    
        aerolinea.aeropuertos = aerolinea.aeropuertos.filter(e => e.id !== aeropuertoId);
        await this.aerolineaRepository.save(aerolinea);
      }
}
