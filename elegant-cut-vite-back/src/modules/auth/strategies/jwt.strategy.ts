import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.cookies?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'your-secret-key-change-in-production',
    });
  }

  async validate(payload: any) {
    // Aquí puedes buscar al usuario en la DB si quieres validar que aún existe o no está bloqueado
    return {
      id: payload.id,
      id_usuario: payload.id_usuario,
      username: payload.username,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      id_rol: payload.id_rol,
      userId: payload.userId || payload.id,
    };
  }
}
