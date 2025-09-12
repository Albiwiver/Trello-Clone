import { IsNotEmpty, IsString, MaxLength } from "class-validator";


export class CreateColumnDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    title: string

    @IsString()
    @IsNotEmpty()
    boardId: string 
    
}
