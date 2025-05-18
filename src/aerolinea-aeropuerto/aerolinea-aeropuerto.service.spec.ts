import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let airlineRepo: Repository<AerolineaEntity>;
  let airportRepo: Repository<AeropuertoEntity>;

  let airline: AerolineaEntity;
  let airports: AeropuertoEntity[] = [];

  const seedDatabase = async () => {
    await airportRepo.clear();
    await airlineRepo.clear();

    const aeropuerto1 = await airportRepo.save({
      nombre: faker.location.city(),
      codigo: faker.string.alpha({ length: 3 }).toUpperCase(),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    const aeropuerto2 = await airportRepo.save({
      nombre: faker.location.city(),
      codigo: faker.string.alpha({ length: 3 }).toUpperCase(),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    airports = [aeropuerto1, aeropuerto2];

    airline = await airlineRepo.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [aeropuerto1],
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(
      AerolineaAeropuertoService,
    );
    airlineRepo = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    airportRepo = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );

    await seedDatabase();
  });

  it('addAirportToAirline debe asociar un aeropuerto a una aerolínea', async () => {
    const newAirport = await airportRepo.save({
      nombre: 'Nuevo Aeropuerto',
      codigo: 'XYZ',
      pais: 'Pais',
      ciudad: 'Ciudad',
    });

    const result = await service.addAirportToAirline(airline.id, newAirport.id);
    expect(result.aeropuertos.length).toBe(2);
    expect(
      result.aeropuertos.find((a) => a.id === newAirport.id),
    ).toBeDefined();
  });

  it('findAirportsFromAirline debe retornar los aeropuertos asociados a la aerolínea', async () => {
    const result = await service.findAirportsFromAirline(airline.id);
    expect(result.length).toBe(1);
  });

  it('findAirportFromAirline debe retornar un aeropuerto asociado', async () => {
    const result = await service.findAirportFromAirline(
      airline.id,
      airports[0].id,
    );
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(airports[0].nombre);
  });

  it('updateAirportsFromAirline debe actualizar los aeropuertos asociados a una aerolínea', async () => {
    const result = await service.updateAirportsFromAirline(airline.id, [
      airports[1],
    ]);
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0].id).toBe(airports[1].id);
  });

  it('deleteAirportFromAirline debe eliminar un aeropuerto asociado', async () => {
    await service.deleteAirportFromAirline(airline.id, airports[0].id);
    const result = await service.findAirportsFromAirline(airline.id);
    expect(result.length).toBe(0);
  });

  it('findAirportFromAirline debe lanzar error si el aeropuerto no está asociado', async () => {
    await expect(() =>
      service.findAirportFromAirline(airline.id, airports[1].id),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id is not associated to the airline',
    );
  });

  it('addAirportToAirline debe lanzar error si el aeropuerto no existe', async () => {
    await expect(() =>
      service.addAirportToAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('addAirportToAirline debe lanzar error si la aerolínea no existe', async () => {
    await expect(() =>
      service.addAirportToAirline('0', airports[1].id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
});
