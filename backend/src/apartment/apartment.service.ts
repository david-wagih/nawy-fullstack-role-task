import { Injectable } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ApartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createApartmentDto: CreateApartmentDto) {
    return this.prisma.apartment.create({ data: createApartmentDto });
  }

  async findAll(search?: string) {
    if (search) {
      return this.prisma.apartment.findMany({
        where: {
          OR: [
            { unitName: { contains: search, mode: 'insensitive' } },
            { unitNumber: { contains: search, mode: 'insensitive' } },
            { project: { contains: search, mode: 'insensitive' } },
          ],
        },
      });
    }
    return this.prisma.apartment.findMany();
  }

  async findOne(id: string) {
    return this.prisma.apartment.findUnique({ where: { id } });
  }

  async update(id: string, updateApartmentDto: UpdateApartmentDto) {
    return this.prisma.apartment.update({ where: { id }, data: updateApartmentDto });
  }

  async remove(id: string) {
    return this.prisma.apartment.delete({ where: { id } });
  }

  async removeImage(id: string, imagePath: string) {
    // Get the apartment
    const apartment = await this.findOne(id);
    if (!apartment) return null;
    // Remove image from images array
    const updatedImages = (apartment.images || []).filter(img => img !== imagePath);
    // Update apartment
    const updatedApartment = await this.update(id, { images: updatedImages });
    // Remove file from disk
    const filePath = path.join(process.cwd(), 'backend', imagePath);
    fs.unlink(filePath, err => {
      if (err) {
        // Optionally log error, but don't throw
      }
    });
    return updatedApartment;
  }
}
