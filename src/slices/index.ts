import { combineReducers } from 'redux'

import authReducer from '@/slices/auth'

const rootReducer = combineReducers({
  authState: authReducer
})

export default rootReducer
