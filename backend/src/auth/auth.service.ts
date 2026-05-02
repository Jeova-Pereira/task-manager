import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)
        if(!passwordsMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto.email, dto.password);

        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);
        return {
            user,
            token,
            message: 'Login successful'
        }
    }

    async register(dto: RegisterDto) {
        const userExists = await this.usersService.findByEmail(dto.email);
        if(userExists) {
            throw new BadRequestException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.createUser({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        });

        const {password:  _, ...userData} = user;
        
        return {
            user: userData,
            message: 'User registered successfully'
        }
    }
}
