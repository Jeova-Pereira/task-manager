import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { create } from 'domain';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService
    ){}

    
    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {email}
        })
        return user
    }
    
    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {id}
        })
        return user;
    }

    async createUser(data: CreateUserDto): Promise<User> {
        const user = await this.findByEmail(data.email);
        if(user) {
            throw new BadRequestException('User with this email already exists')
        }
        return this.prisma.user.create({data});
    }

    async updateUser(id: string, data: UpdateUserDto): Promise<User> {
        const user = await this.findById(id)
        if(!user) {
            throw new NotFoundException('User with this id not exists')
        }
        return this.prisma.user.update({
            where: {id},
            data
        })
    }

    async deleteUser(id: string): Promise<User> {
        await this.findById(id)
        return this.prisma.user.delete({
            where: {id}
        })
    }
}
