import { Injectable } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { PrismaService } from '../prisma/prisma.service';

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
}
