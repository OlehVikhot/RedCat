import { SetMetadata } from '@nestjs/common';
import { EPermissions } from '../../constant/EPermissions';

export const Permissions = (permissions: EPermissions[]) =>
  SetMetadata('permissions', permissions);
