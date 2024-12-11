import { IsString, IsNumber, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBidDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  lotId: string;

  @IsNumber({ maxDecimalPlaces:2 })
  @Min(0)
  amount: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;
}
