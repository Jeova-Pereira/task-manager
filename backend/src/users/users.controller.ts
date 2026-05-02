import { Controller, Get, Post, Patch, Delete, Param, Body} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ){}

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @Post()
    async createUser(@Body() dto:CreateUserDto) {
        return this.userService.createUser(dto)
    }

    @Patch(':id')
    async updateUSer(@Param('id') id: string, @Body() dto:UpdateUserDto) {
        return this.userService.updateUser(id, dto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string){
        return this.userService.deleteUser(id)
    }

}
