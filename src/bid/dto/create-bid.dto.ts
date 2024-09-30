import { IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBidDto {
  @IsString()
  userId: string;

  @IsString()
  lotId: string;

  @IsNumber()
  amount: number;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
