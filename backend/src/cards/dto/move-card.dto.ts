import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";


export class MoveCardDto {

    @IsOptional()
    @IsString()
    toColumnId?: string;


    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    toOrder?: number;

}