import { Injectable } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class ApartmentService {
  async create(createApartmentDto: CreateApartmentDto) {
    return prisma.apartment.create({ data: createApartmentDto });
  }

  async findAll(search?: string) {
    if (search) {
      return prisma.apartment.findMany({
        where: {
          OR: [
            { unitName: { contains: search, mode: 'insensitive' } },
            { unitNumber: { contains: search, mode: 'insensitive' } },
            { project: { contains: search, mode: 'insensitive' } },
          ],
        },
      });
    }
    return prisma.apartment.findMany();
  }

  async findOne(id: string) {
    return prisma.apartment.findUnique({ where: { id } });
  }

  async update(id: string, updateApartmentDto: UpdateApartmentDto) {
    return prisma.apartment.update({ where: { id }, data: updateApartmentDto });
  }

  async remove(id: string) {
    return prisma.apartment.delete({ where: { id } });
  }
}
