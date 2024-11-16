import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBidDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  lotId: string;

  @IsNumber()
  amount: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;
}
