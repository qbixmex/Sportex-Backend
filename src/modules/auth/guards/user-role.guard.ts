import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity.js';
import { META_ROLES } from '../decorators/role-protected.decorator.js';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const validRoles: string[] = this.reflector.getAllAndOverride(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (validRoles.length > 0) {
      for (const role of user.roles) {
        if (validRoles.includes(role)) {
          return true;
        }
      }
    } else {
      return true;
    }

    throw new ForbiddenException(
      'No estas autorizado para realizar esta acción'
    );
  }
}
