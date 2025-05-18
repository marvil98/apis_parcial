/* eslint-disable prettier/prettier */
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
} from "@nestjs/common";
import { AerolineaService } from "./aerolinea.service";
import { AerolineaEntity } from "./aerolinea.entity/aerolinea.entity";
import { BusinessErrorsInterceptor } from "src/shared/interceptors/business-errors/business-errors.interceptor";
import { AerolineaDto } from "./aerolinea.dto/aerolinea.dto";
import { plainToInstance } from "class-transformer";

@Controller("airlines")
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
  constructor(private readonly aerolineaService: AerolineaService) {}

  @Get()
  async findAll() {
    return await this.aerolineaService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.aerolineaService.findOne(id);
  }

  @Post()
  async create(@Body() aerolineaDto: AerolineaDto) {
    const aerolinea: AerolineaEntity = plainToInstance(
      AerolineaEntity,
      aerolineaDto,
    );
    return await this.aerolineaService.create(aerolinea);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() aerolineaDto: AerolineaDto) {
    const aerolinea: AerolineaEntity = plainToInstance(
      AerolineaEntity,
      aerolineaDto,
    );
    return await this.aerolineaService.update(id, aerolinea);
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: string) {
    return await this.aerolineaService.delete(id);
  }
}
