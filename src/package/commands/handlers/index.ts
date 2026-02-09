// commands/handlers/index.ts
import { CreatePackageHandler } from './create-package.handler';
import { DeletePackageHandler } from './delete-package.handler';
import { UpdatePackageHandler } from './update-package.handler';
import { CreatePackagesBulkHandler } from './create-packages-bulk.handler';

const commandHandlers = [
  CreatePackageHandler,
  DeletePackageHandler,
  UpdatePackageHandler,
  CreatePackagesBulkHandler,
];

export default commandHandlers;
