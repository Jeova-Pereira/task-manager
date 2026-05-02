import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { SafeUser } from './types/safe-user.type';
import { safeUserSelect } from './constants/user-select.constant';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService
    ){}

    
    async findAll(): Promise<SafeUser[]> {
        return this.prisma.user.findMany({
            select: safeUserSelect
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {email},
        })
        return user
    }
    
    async findById(id: string): Promise<SafeUser | null> {
        const user = await this.prisma.user.findUnique({
            where: {id},
            select: safeUserSelect
        })
        return user;
    }

    async createUser(data: {name:string, email:string, password:string}): Promise<User> {
        const user = await this.findByEmail(data.email);
        if(user) {
            throw new BadRequestException('User with this email already exists')
        }
        return this.prisma.user.create({data});
    }

    async updateUser(id: string, data: UpdateUserDto): Promise<SafeUser> {
        const user = await this.findById(id)
        if(!user) {
            throw new NotFoundException('User with this id not exists')
        }
        return this.prisma.user.update({
            where: {id},
            data,
            select: safeUserSelect
        })
    }

    async deleteUser(id: string): Promise<SafeUser> {
        await this.findById(id)
        return this.prisma.user.delete({
            where: {id},
            select: safeUserSelect
        })
    }
}
