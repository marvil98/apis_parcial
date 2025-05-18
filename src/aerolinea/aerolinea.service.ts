import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find();
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id } });
        if (!aerolinea)
          throw new BusinessLogicException('The airline with the given id was not found', BusinessError.NOT_FOUND);
        return aerolinea;
    }

    async create(data: Partial<AerolineaEntity>): Promise<AerolineaEntity> {
        if (data.fechaFundacion && new Date(data.fechaFundacion) >= new Date()) {
            throw new BusinessLogicException(
              'The foundation date must be in the past',
              BusinessError.BAD_REQUEST,
            );
          }
    
        const nuevaAerolinea = this.aerolineaRepository.create(data);
        return await this.aerolineaRepository.save(nuevaAerolinea);
    }

    async update(id: string, data: Partial<AerolineaEntity>): Promise<AerolineaEntity> {
        const aerolinea = await this.findOne(id);
    
        if (data.fechaFundacion && new Date(data.fechaFundacion) >= new Date()) {
          throw new BusinessLogicException('The foundation date must be in the past', BusinessError.BAD_REQUEST);
        }
    
        Object.assign(aerolinea, data);
        return await this.aerolineaRepository.save(aerolinea);
    }

    async delete(id: string): Promise<void> {
        const aerolinea = await this.findOne(id);
        await this.aerolineaRepository.remove(aerolinea);
    }
}
