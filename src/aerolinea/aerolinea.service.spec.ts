import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineas: AerolineaEntity[] = [];

  const seedDatabase = async () => {
    repository.clear();
    aerolineas = [];
    for (let i = 0; i < 5; i++) {
      const entity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.past(),
        paginaWeb: faker.internet.url(),
      });
      aerolineas.push(entity);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();
  
    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  }, 20000);

  it('findAll debe retornar todas las aerolíneas', async () => {
    const result = await service.findAll();
    expect(result.length).toBe(aerolineas.length);
  });

  it('findOne debe retornar una aerolínea por id', async () => {
    const result = await service.findOne(aerolineas[0].id);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(aerolineas[0].nombre);
  });

  it('findOne debe lanzar error si la aerolínea no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('create debe crear una nueva aerolínea', async () => {
    const nueva = {
      nombre: 'AeroTest',
      descripcion: 'Prueba de aerolínea',
      fechaFundacion: new Date('2000-01-01'),
      paginaWeb: 'https://aerotest.com',
    };
    const result = await service.create(nueva);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual('AeroTest');
  });

  it('create debe lanzar error si la fecha de fundación es futura', async () => {
    const futura = {
      nombre: 'Futura',
      descripcion: 'Error esperado',
      fechaFundacion: new Date('2100-01-01'),
      paginaWeb: 'https://futura.com',
    };
    await expect(() => service.create(futura)).rejects.toHaveProperty("message", "The foundation date must be in the past");
  });

  it('update debe modificar una aerolínea existente', async () => {
    const aerolinea = aerolineas[0];
    const cambio = { nombre: 'NombreModificado' };
    const result = await service.update(aerolinea.id, cambio);
    expect(result.nombre).toEqual('NombreModificado');
  });

  it('update debe lanzar error si la fecha de fundación es futura', async () => {
    const aerolinea = aerolineas[0];
    await expect(() =>
      service.update(aerolinea.id, { fechaFundacion: faker.date.future() })
    ).rejects.toHaveProperty("message", "The foundation date must be in the past");
  });

  it('delete debe eliminar una aerolínea existente', async () => {
    const aerolinea = aerolineas[0];
    await service.delete(aerolinea.id);
    const result = await repository.findOne({ where: { id: aerolinea.id } });
    expect(result).toBeNull();
  });

  it('delete debe lanzar error si la aerolínea no existe', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });
});
