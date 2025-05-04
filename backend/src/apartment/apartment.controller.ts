import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('apartments')
@Controller('apartments')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new apartment' })
  @ApiResponse({ status: 201, description: 'Apartment created successfully.' })
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
  create(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentService.create(createApartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all apartments or search by unitName, unitNumber, or project' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by unitName, unitNumber, or project' })
  @ApiResponse({ status: 200, description: 'List of apartments.' })
  findAll(@Query('search') search?: string) {
    return this.apartmentService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get apartment by ID' })
  @ApiResponse({ status: 200, description: 'Apartment details.' })
  @ApiResponse({ status: 404, description: 'Apartment not found.' })
  findOne(@Param('id') id: string) {
    return this.apartmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an apartment by ID' })
  @ApiResponse({ status: 200, description: 'Apartment updated.' })
  @ApiResponse({ status: 404, description: 'Apartment not found.' })
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
  update(@Param('id') id: string, @Body() updateApartmentDto: UpdateApartmentDto) {
    return this.apartmentService.update(id, updateApartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an apartment by ID' })
  @ApiResponse({ status: 200, description: 'Apartment deleted.' })
  @ApiResponse({ status: 404, description: 'Apartment not found.' })
  remove(@Param('id') id: string) {
    return this.apartmentService.remove(id);
  }
}
