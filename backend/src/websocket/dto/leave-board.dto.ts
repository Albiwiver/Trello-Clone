import { IsOptional } from "class-validator";


export class LeaveBoardDto {
    
    @IsOptional()
    boardId: string
    
}