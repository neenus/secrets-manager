import { Router } from 'express';
import { getSecretsByProjectName, saveSecrets } from '@controllers/secrets.controller';
import validateApiKey from "@middleware/authenticate.middleware";

const router: Router = Router();

router.use(validateApiKey);

router.get('/', getSecretsByProjectName);
router.post('/', saveSecrets);

export default router;