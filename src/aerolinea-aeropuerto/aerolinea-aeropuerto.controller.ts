import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { plainToInstance } from 'class-transformer';


@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
  constructor(
    private readonly aerolineaAeropuertoService: AerolineaAeropuertoService,
  ) {}

  @Post(':airlineId/airports/:airportId')
  async addAirportToAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.aerolineaAeropuertoService.addAirportToAirline(
      airlineId,
      airportId,
    );
  }

  @Get(':airlineId/airports')
  async findAirportsFromAirline(@Param('airlineId') airlineId: string) {
    return await this.aerolineaAeropuertoService.findAirportsFromAirline(
      airlineId,
    );
  }

  @Get(':airlineId/airports/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.aerolineaAeropuertoService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Put(':airlineId/airports')
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: string,
    @Body() aeropuertosDto: AeropuertoEntity[],
  ) {
    const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto);
    return await this.aerolineaAeropuertoService.updateAirportsFromAirline(
      airlineId,
      aeropuertos,
    );
  }

  @Delete(':airlineId/airports/:airportId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.aerolineaAeropuertoService.deleteAirportFromAirline(
      airlineId,
      airportId,
    );
  }
}