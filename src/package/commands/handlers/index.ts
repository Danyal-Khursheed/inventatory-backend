// commands/handlers/index.ts
import { CreatePackageHandler } from './create-package.handler';
import { DeletePackageHandler } from './delete-package.handler';
import { UpdatePackageHandler } from './update-package.handler';

const commandHandlers = [
  CreatePackageHandler,
  DeletePackageHandler,
  UpdatePackageHandler,
];

export default commandHandlers;
