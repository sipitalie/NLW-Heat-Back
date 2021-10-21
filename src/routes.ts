import { Router } from 'express';
import { 
  AuthenticateUserController 
} from './controllers/AuthenticateUserController';
import { 
  CreateMessageController
} from './controllers/CreateMessageController';
import { 
  GetLast3MessagesController
} from './controllers/GetLast3MessagesController';
import { ProfileUserController } from './controllers/ProfileUserController';
import { 
  ensureAuthenticated
} from './middleware/ensureAuthenticated';

const router =Router();

router.post('/authenticate', new AuthenticateUserController().handler);

router.post('/messages',
  ensureAuthenticated,
  new CreateMessageController().handler
);

router.get('/messages/last3', new GetLast3MessagesController().handler);

router.get('/profile',
  ensureAuthenticated,
  new ProfileUserController().handler
);

export {router};