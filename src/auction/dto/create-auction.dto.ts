import { State } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator';

export class CreateAuctionDto {
  
  @IsString()
  @IsOptional()
  organizerId?: string

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

  @IsEnum(State)
  @IsOptional()
  state?: State;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deletedAt?: Date;
  

}

