import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}