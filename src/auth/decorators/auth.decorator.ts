import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { RoleProtected } from './role-protected.decorator';
import { Roles } from '@prisma/client';


export function Auth(...role: Roles[]) {

    return applyDecorators(
        RoleProtected(...role),
        UseGuards( AuthGuard(), UserRoleGuard ),
    );
}