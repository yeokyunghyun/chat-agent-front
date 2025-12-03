import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { configureStore} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '@/slices'
import { Provider } from 'react-redux'
import rootSaga from './sagas/index.ts'


const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        thunk: false,
        serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// sagaMiddleware 실행
sagaMiddleware.run(rootSaga);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
