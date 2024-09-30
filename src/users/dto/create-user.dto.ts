
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Roles } from '../../common/enums/roles.enum';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  last_name: string;
  
  @IsString()
  username: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  password: string;
  
  @IsEnum(Roles)
  @IsOptional()
  roles?: Roles;         // Role opcional, por defecto USER
  
  @IsBoolean()
  @IsOptional()
  available?: boolean;
  
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt?: Date;
  
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deletedAt: Date;    //Agregado para hacer soft delete de usuario  
  
  @IsBoolean()
  @IsOptional()
  verified: boolean;
}
