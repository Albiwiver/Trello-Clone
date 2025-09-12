import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";


export class CreateCardDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    title: string

    @IsString()
    @IsNotEmpty()
    columnId: string

    @IsOptional()
    @IsString()
    @MaxLength(250)
    content?: string 

    
    
}
