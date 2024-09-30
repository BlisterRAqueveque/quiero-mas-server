import { IsString, IsOptional, IsArray, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLotDto {
  @IsString()
  auctionId: string;

  @IsString()
  description: string;

  @IsNumber()
  startingPrice: number;

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
