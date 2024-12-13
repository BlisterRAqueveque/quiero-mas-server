import { IsString, IsOptional, IsArray, IsDate, IsNumber, IsBoolean, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLotDto {

  
  @IsString()
  @IsOptional()
  auctionId?: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  startingPrice: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  currentPrice?: number;

  @IsString()
  exhibitionPlace: string;

  @IsDate()
  @Type(() => Date)
  exhibitionTime: Date;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsArray()
  @IsOptional()
  videos?: string[];

  @IsOptional()
  @IsString()
  winnerId?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deletedAt?: Date;

}
