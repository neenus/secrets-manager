import { Router } from 'express';
import { register } from "@controllers/users.controller";

const router: Router = Router();

router.post('/register', register);

export default router;