// commands/handlers/index.ts
import { CreatePackageHandler } from './create-package.handler';
import { DeletePackageHandler } from './delete-package.handler';

const commandHandlers = [CreatePackageHandler, DeletePackageHandler];

export default commandHandlers;
