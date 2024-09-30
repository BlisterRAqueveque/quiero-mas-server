import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsDate } from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  organizerId: string;

  @IsString()
  description: string;

  @IsString()
  contact: string;

  @IsString()
  address: string;

  @IsDate()
  @Type(() => Date)
  auctionDate: Date;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsString()
  photo: string;

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

