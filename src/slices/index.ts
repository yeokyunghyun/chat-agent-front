import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@/slices/auth';
import chatReducer from '@/slices/chat';

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;