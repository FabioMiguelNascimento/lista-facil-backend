import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // tenta extrair do cookie (principal para o frontend) e, como fallback,
      // do Authorization: Bearer <token> (útil para API clients / testes)
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.access_token,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
      // restringe algoritmos aceitos (melhora segurança contra "alg none" etc.)
      algorithms: ['HS256'],
    });
  }

  // tipagem mínima do payload para clareza e segurança
  async validate(payload: { sub?: string | number; email?: string; iat?: number; exp?: number }) {
    if (!payload?.sub) return null;
    return { userId: payload.sub, email: payload.email };
  }
}