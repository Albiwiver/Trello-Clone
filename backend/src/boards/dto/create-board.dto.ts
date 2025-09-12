import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator";


export class CreateBoardDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    title: string;

    @IsOptional()
    @IsString() 
    @MaxLength(300)
    description?: string;

    @IsString() 
    @IsNotEmpty()
    ownerId: string;

}
