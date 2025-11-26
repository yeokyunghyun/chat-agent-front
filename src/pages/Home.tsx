import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { login } from '@/slices/auth'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const loginUser = () => {
    dispatch(login({username, password}));
  }

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>로그인</h2>

        <input
          style={styles.input}
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={loginUser}>
          로그인
        </button>

        {/* 회원가입 버튼 추가 */}
        <button style={styles.registerButton} onClick={goToRegister}>
          회원가입
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  registerButton: {
    marginTop: "10px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#28a745", // 초록색 버튼
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
