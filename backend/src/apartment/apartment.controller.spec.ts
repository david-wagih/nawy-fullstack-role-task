import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentController } from './apartment.controller';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { ApiResponse } from './entities/apartment.entity';

describe('ApartmentController', () => {
  let controller: ApartmentController;
  let service: ApartmentService;

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

  const mockService = {
    create: jest.fn().mockResolvedValue(mockApartment),
    findAll: jest.fn().mockResolvedValue([mockApartment]),
    findOne: jest.fn().mockResolvedValue(mockApartment),
    update: jest.fn().mockResolvedValue({ ...mockApartment, price: 1200 }),
    remove: jest.fn().mockResolvedValue(mockApartment),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApartmentController],
      providers: [
        { provide: ApartmentService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ApartmentController>(ApartmentController);
    service = module.get<ApartmentService>(ApartmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an apartment', async () => {
    const dto: CreateApartmentDto = {
      unitName: 'A',
      unitNumber: '101',
      project: 'ProjectX',
      address: '123 Main St',
      bedrooms: 2,
      bathrooms: 1,
      price: 1000,
      description: 'Nice apartment',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(new ApiResponse(201, 'Apartment created successfully', mockApartment));
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all apartments', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(new ApiResponse(200, 'Apartments fetched successfully', [mockApartment]));
    expect(service.findAll).toHaveBeenCalledWith(undefined);
  });

  it('should return filtered apartments', async () => {
    await controller.findAll('A');
    expect(service.findAll).toHaveBeenCalledWith('A');
  });

  it('should return an apartment by id', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(new ApiResponse(200, 'Apartment fetched successfully', mockApartment));
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update an apartment', async () => {
    const dto: UpdateApartmentDto = { price: 1200 };
    const result = await controller.update('1', dto);
    expect(result).toEqual(new ApiResponse(200, 'Apartment updated successfully', { ...mockApartment, price: 1200 }));
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete an apartment', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual(new ApiResponse(200, 'Apartment deleted successfully', mockApartment));
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
