import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  last_name: string;
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  verified: boolean;
}
