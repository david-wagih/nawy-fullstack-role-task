import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentService } from './apartment.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ApartmentService', () => {
  let service: ApartmentService;
  let prisma: PrismaService;

  const mockApartment = {
    id: '1',
    unitName: 'A',
    unitNumber: '101',
    project: 'ProjectX',
    address: '123 Main St',
    bedrooms: 2,
    bathrooms: 1,
    price: 1000,
    description: 'Nice apartment',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrisma = {
    apartment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApartmentService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<ApartmentService>(ApartmentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an apartment', async () => {
    mockPrisma.apartment.create.mockResolvedValue(mockApartment);
    const dto = { ...mockApartment };
    delete dto.id;
    delete dto.createdAt;
    delete dto.updatedAt;
    expect(await service.create(dto)).toEqual(mockApartment);
    expect(mockPrisma.apartment.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should return all apartments', async () => {
    mockPrisma.apartment.findMany.mockResolvedValue([mockApartment]);
    expect(await service.findAll()).toEqual([mockApartment]);
    expect(mockPrisma.apartment.findMany).toHaveBeenCalled();
  });

  it('should return filtered apartments', async () => {
    mockPrisma.apartment.findMany.mockResolvedValue([mockApartment]);
    await service.findAll('A');
    expect(mockPrisma.apartment.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { unitName: { contains: 'A', mode: 'insensitive' } },
          { unitNumber: { contains: 'A', mode: 'insensitive' } },
          { project: { contains: 'A', mode: 'insensitive' } },
        ],
      },
    });
  });

  it('should return an apartment by id', async () => {
    mockPrisma.apartment.findUnique.mockResolvedValue(mockApartment);
    expect(await service.findOne('1')).toEqual(mockApartment);
    expect(mockPrisma.apartment.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should update an apartment', async () => {
    mockPrisma.apartment.update.mockResolvedValue({ ...mockApartment, price: 1200 });
    const dto = { price: 1200 };
    expect(await service.update('1', dto)).toEqual({ ...mockApartment, price: 1200 });
    expect(mockPrisma.apartment.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto });
  });

  it('should delete an apartment', async () => {
    mockPrisma.apartment.delete.mockResolvedValue(mockApartment);
    expect(await service.remove('1')).toEqual(mockApartment);
    expect(mockPrisma.apartment.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
