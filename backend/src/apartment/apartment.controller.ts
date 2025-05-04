import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ApiResponse } from './entities/apartment.entity';

@ApiTags('apartments')
@Controller('apartments')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new apartment' })
  @SwaggerApiResponse({ status: 201, description: 'Apartment created successfully.' })
  @ApiBody({
    type: CreateApartmentDto,
    examples: {
      sample: {
        summary: 'Sample apartment',
        value: {
          unitName: 'A',
          unitNumber: '101',
          project: 'ProjectX',
          address: '123 Main St',
          bedrooms: 2,
          bathrooms: 1,
          price: 1000,
          description: 'Nice apartment',
        },
      },
    },
  })
  async create(@Body() createApartmentDto: CreateApartmentDto) {
    const data = await this.apartmentService.create(createApartmentDto);
    return new ApiResponse(201, 'Apartment created successfully', data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all apartments or search by unitName, unitNumber, or project' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by unitName, unitNumber, or project' })
  @SwaggerApiResponse({ status: 200, description: 'List of apartments.' })
  async findAll(@Query('search') search?: string) {
    const data = await this.apartmentService.findAll(search);
    return new ApiResponse(200, 'Apartments fetched successfully', data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get apartment by ID' })
  @SwaggerApiResponse({ status: 200, description: 'Apartment details.' })
  @SwaggerApiResponse({ status: 404, description: 'Apartment not found.' })
  async findOne(@Param('id') id: string) {
    const data = await this.apartmentService.findOne(id);
    if (!data) {
      throw new NotFoundException(new ApiResponse(404, 'Apartment not found', null));
    }
    return new ApiResponse(200, 'Apartment fetched successfully', data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an apartment by ID' })
  @SwaggerApiResponse({ status: 200, description: 'Apartment updated.' })
  @SwaggerApiResponse({ status: 404, description: 'Apartment not found.' })
  @ApiBody({
    type: UpdateApartmentDto,
    examples: {
      sample: {
        summary: 'Sample update',
        value: {
          price: 1200,
          description: 'Updated description',
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateApartmentDto: UpdateApartmentDto) {
    const data = await this.apartmentService.update(id, updateApartmentDto);
    if (!data) {
      throw new NotFoundException(new ApiResponse(404, 'Apartment not found', null));
    }
    return new ApiResponse(200, 'Apartment updated successfully', data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an apartment by ID' })
  @SwaggerApiResponse({ status: 200, description: 'Apartment deleted.' })
  @SwaggerApiResponse({ status: 404, description: 'Apartment not found.' })
  async remove(@Param('id') id: string) {
    const data = await this.apartmentService.remove(id);
    if (!data) {
      throw new NotFoundException(new ApiResponse(404, 'Apartment not found', null));
    }
    return new ApiResponse(200, 'Apartment deleted successfully', data);
  }
}
