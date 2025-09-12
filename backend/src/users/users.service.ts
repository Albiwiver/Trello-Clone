import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService){}
  
  
  async createUser({fullName, password, email}: CreateUserDto) {
    const passwordHash = await bcrypt.hash(password, 10)
    
    try {
      const user = await this.prismaService.user.create({
        data:{fullName, passwordHash, email},
        select: {id: true, fullName: true, email: true}
      })
      
      return user
      
    } catch (error) {  
      if(await this.prismaService.user.findUnique({where:{email}}))
       throw new ConflictException('Email already exists')
    }
  }


  async findAllUsers() {
    const users = await this.prismaService.user.findMany({
      select:{
        id:true,
        fullName: true,
        email:true,
        ownedBoards: {select: {id:true, title:true}}
      }});

      if(users.length <= 0 || !users) {
        throw new NotFoundException('Cannot find users')  
      }
      return users
  }



  async findUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {id},
      select: {id: true, fullName: true, email: true}
    })
    if(!user)
      throw new NotFoundException('User not found')
    return user
  }



  async updateUser(id: string, dto: UpdateUserDto = {} as UpdateUserDto) {
  const before = await this.findUserById(id); 
  const { fullName, email } = dto;
  const data: any = {
    ...(fullName !== undefined && { fullName }),
    ...(email    !== undefined && { email }),
  };

  if (Object.keys(data).length === 0) return before;

  try {
    return await this.prismaService.user.update({
      where: { id },
      data,
      select: { id: true, email: true, fullName: true },
    });
  } catch (error: any) {
    if (error.code === 'P2002') throw new ConflictException('That email is already registered');
    if (error.code === 'P2025') throw new NotFoundException('User not found');
    throw new InternalServerErrorException('Update failed');
  }
}



  async removeUser(id: string) {
    await this.findUserById(id)
    await this.prismaService.user.delete({where:{id}})
    
  }


  

 
}
