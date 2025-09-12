import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

   constructor(private readonly prismaService: PrismaService) {}

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {id:true, email: true, fullName: true, passwordHash: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const { passwordHash, ...data } = user;
    return data // { id, email, fullName }
  }
    
}
