import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType } from '../../common/enums/property.enum';
import { Operation } from '../../common/enums/operation.enum';

export class CreatePropertyDto {
  @IsString()
  address: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  services?: string;

  @IsString()
  @IsOptional()
  amenities?: string;

  @IsString()
  @IsOptional()
  floors?: string;

  @IsNumber()
  @IsOptional()
  constructed_area?: number;

  @IsNumber()
  @IsOptional()
  unbuilt_surface?: number;

  @IsNumber()
  @IsOptional()
  total_suface?: number;

  @IsNumber()
  @IsOptional()
  years?: number;

  @IsString()
  contact: string;

  @IsString()
  userId: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsEnum(Operation)
  operation: Operation;

  @IsNumber()
  @IsOptional()
  rooms?: number;

  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsArray()
  @IsOptional()
  videos?: string[];

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
  deletedAt?: Date;
}

