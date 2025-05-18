import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: AeropuertoEntity[] = [];

  const seedDatabase = async () => {
    await repository.clear();
    aeropuertoList = [];

    for (let i = 0; i < 5; i++) {
      const aeropuerto = await repository.save({
        nombre: faker.location.city(),
        codigo: faker.string.alpha({ length: 3 }).toUpperCase(),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
      });
      aeropuertoList.push(aeropuerto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  it('findAll debe retornar todos los aeropuertos', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(aeropuertoList.length);
  });

  it('findOne debe retornar un aeropuerto por id', async () => {
    const result = await service.findOne(aeropuertoList[0].id);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(aeropuertoList[0].nombre);
  });

  it('findOne debe lanzar error si el aeropuerto no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "The airport with the given id was not found"
    );
  });

  it('create debe crear un nuevo aeropuerto', async () => {
    const newAirport: Partial<AeropuertoEntity> = {
      nombre: faker.location.city(),
      codigo: 'ABC',
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    };

    const result = await service.create(newAirport);
    expect(result).not.toBeNull();
  });

  it('create debe lanzar error si el código es mayor a 3 caracteres', async () => {
    const invalidAirport: Partial<AeropuertoEntity> = {
      nombre: faker.location.city(),
      codigo: 'ABCD',
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    };

    await expect(() => service.create(invalidAirport)).rejects.toHaveProperty(
      "message",
      "The airport code must have exactly 3 characters"
    );
  });

  it('update debe modificar un aeropuerto existente', async () => {
    const airport = aeropuertoList[0];
    const updated = { nombre: 'Updated Airport' };

    const result = await service.update(airport.id, updated);
    expect(result.nombre).toEqual(updated.nombre);
  });

  it('update debe lanzar un error si el id del aeropuerto no existe', async () => {
    await expect(() =>
      service.update("0", { nombre: 'Invalid Update' })
    ).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('update debe lanzar error si el código es mayor a 3 caracteres', async () => {
    const airport = aeropuertoList[0];
    await expect(() =>
      service.update(airport.id, { codigo: 'LONG' })
    ).rejects.toHaveProperty("message", "The airport code must have exactly 3 characters");
  });

  it('delete debe eliminar un aeropuerto existente', async () => {
    const airport = aeropuertoList[0];
    await service.delete(airport.id);
    const result = await repository.findOne({ where: { id: airport.id } });
    expect(result).toBeNull();
  });

  it('delete debe lanzar error si el aeropuerto no existe', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "The airport with the given id was not found"
    );
  });
});
