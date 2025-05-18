import { Injectable } from '@nestjs/common';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ){}
    
    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find({ relations: ['aerolineas'] });
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
        const airport = await this.aeropuertoRepository.findOne({
          where: { id },
          relations: ['aerolineas'],
        });
    
        if (!airport) {
          throw new BusinessLogicException(
            'The airport with the given id was not found',
            BusinessError.NOT_FOUND,
          );
        }
    
        return airport;
    }

    async create(data: Partial<AeropuertoEntity>): Promise<AeropuertoEntity> {
        if (!data.codigo || data.codigo.length !== 3) {
          throw new BusinessLogicException(
            'The airport code must have exactly 3 characters',
            BusinessError.BAD_REQUEST,
          );
        }
    
        const newAirport = this.aeropuertoRepository.create(data);
        return await this.aeropuertoRepository.save(newAirport);
    }

    async update(id: string, data: Partial<AeropuertoEntity>): Promise<AeropuertoEntity> {
        const airport = await this.aeropuertoRepository.findOne({ where: { id } });
    
        if (!airport) {
          throw new BusinessLogicException(
            'The airport with the given id was not found',
            BusinessError.NOT_FOUND,
          );
        }
    
        if (data.codigo && data.codigo.length !== 3) {
          throw new BusinessLogicException(
            'The airport code must have exactly 3 characters',
            BusinessError.BAD_REQUEST,
          );
        }
    
        Object.assign(airport, data);
        return await this.aeropuertoRepository.save(airport);
    }


  async delete(id: string): Promise<void> {
    const airport = await this.aeropuertoRepository.findOne({ where: { id } });

    if (!airport) {
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    await this.aeropuertoRepository.remove(airport);
  }
}
