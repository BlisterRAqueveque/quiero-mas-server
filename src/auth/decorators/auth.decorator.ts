import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { Roles } from '../../common/enums/roles.enum';
import { RoleProtected } from './role-protected.decorator';


export function Auth(...role: Roles[]) {

    return applyDecorators(
        RoleProtected(...role),
        UseGuards( AuthGuard(), UserRoleGuard ),
    );
}