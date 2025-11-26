import { all, put, takeLatest, select } from 'redux-saga/effects'
import { login, loginSuccess, loginError } from '@/slices/auth'
import { useSelector } from "react-redux";
import { getAuth } from "@/selectors";

import axios from "axios"

function* loginUser(action: ReturnType<typeof login>) {
  try {
    const { username, password } = action.payload

    const { data } = yield axios.post("http://localhost:8443/api/login", {
      username,
      password
    })

    localStorage.setItem("ACCESS_TOKEN", data.accessToken)
    localStorage.setItem("REFRESH_TOKEN", data.refreshToken)

    yield put(loginSuccess(username))
    const auth = useSelector(getAuth);
    console.log('auth >>> ', auth);

  } catch (err: any) {
    const msg = err.response?.data?.error ?? "로그인 실패"
    yield put(loginError(msg))
  }
}

function* rootSaga() {
  yield all([
    takeLatest(login.type, loginUser),
  ])
}

export default rootSaga