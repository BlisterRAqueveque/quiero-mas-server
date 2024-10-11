import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../common/enums/roles.enum';

export const META_ROLES = 'role';

export const RoleProtected = (...args: Roles[]) => {

    return SetMetadata( META_ROLES, args);
}