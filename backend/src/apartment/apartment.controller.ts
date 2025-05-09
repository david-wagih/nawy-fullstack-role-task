import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { DeleteApartmentImageDto } from './dto/delete-apartment-image.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiQuery, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ApiResponse } from './entities/apartment.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';

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

  @Post(':id/images')
  @ApiOperation({ summary: 'Upload images for an apartment' })
  @SwaggerApiResponse({ status: 200, description: 'Images uploaded successfully.' })
  @SwaggerApiResponse({ status: 400, description: 'No files uploaded.' })
  @SwaggerApiResponse({ status: 404, description: 'Apartment not found.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: diskStorage({
      destination: './uploads/apartments',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFiles() files: MulterFile[]
  ) {
    if (!files || files.length === 0) {
      throw new NotFoundException(new ApiResponse(400, 'No files uploaded', null));
    }
    // Get the apartment
    const apartment = await this.apartmentService.findOne(id);
    if (!apartment) {
      throw new NotFoundException(new ApiResponse(404, 'Apartment not found', null));
    }
    // Update images array
    const imagePaths = files.map(file => `/uploads/apartments/${file.filename}`);
    const updatedImages = apartment.images ? [...apartment.images, ...imagePaths] : imagePaths;
    const updatedApartment = await this.apartmentService.update(id, { images: updatedImages });
    return new ApiResponse(200, 'Images uploaded successfully', updatedApartment);
  }

  @Delete(':id/images')
  @ApiOperation({ summary: 'Delete an image from an apartment' })
  @SwaggerApiResponse({ status: 200, description: 'Image deleted successfully.' })
  @SwaggerApiResponse({ status: 404, description: 'Apartment or image not found.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', example: '/uploads/apartments/filename.jpg' },
      },
      required: ['image'],
    },
  })
  async deleteImage(@Param('id') id: string, @Body() body: DeleteApartmentImageDto) {
    const updatedApartment = await this.apartmentService.removeImage(id, body.image);
    if (!updatedApartment) {
      throw new NotFoundException(new ApiResponse(404, 'Apartment or image not found', null));
    }
    return new ApiResponse(200, 'Image deleted successfully', updatedApartment);
  }
}
