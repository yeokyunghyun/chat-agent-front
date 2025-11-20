import { all, put, takeLatest, select } from 'redux-saga/effects'
import { login, loginSuccess, loginError } from '@/slices/auth'
import axios from "axios"

function* loginUser() {
  try {
     const { data } = yield axios('/api/login')
      yield put(loginSuccess(data))
  } catch (error: any) {
      yield put(loginError(error.message))
  }
}

function* rootSaga() {
  yield all([
    takeLatest(login.type, loginUser),
  ])
}

export default rootSaga