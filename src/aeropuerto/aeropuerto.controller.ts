import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AeropuertoDto } from './aeropuerto.dto/aeropuerto.dto';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
  constructor(private readonly aeropuertoService: AeropuertoService) {}

  @Get()
  async findAll() {
    return await this.aeropuertoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.aeropuertoService.findOne(id);
  }

  @Post()
  async create(@Body() aeropuertoDto: AeropuertoDto) {
    const aeropuerto = plainToInstance(AeropuertoEntity, aeropuertoDto);
    return await this.aeropuertoService.create(aeropuerto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() aeropuertoDto: AeropuertoDto) {
    const aeropuerto = plainToInstance(AeropuertoEntity, aeropuertoDto);
    return await this.aeropuertoService.update(id, aeropuerto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.aeropuertoService.delete(id);
  }
}
