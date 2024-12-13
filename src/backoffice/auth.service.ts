import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(email: string, password: string): Promise<{ message: string }> {
    // Verificar si el correo ya está registrado
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado.');
    }

    // Crear el nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword });
    await this.userRepository.save(user);

    return { message: 'Usuario registrado exitosamente.' };
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    // Buscar usuario por correo
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Generar el token JWT
    const payload = { email: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
