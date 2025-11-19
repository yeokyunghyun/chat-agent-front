import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post("http://localhost:8443/api/register", {
        username,
        password,
      });

      alert("회원가입 성공!");
      navigate("/"); // 회원가입 성공 → 로그인 페이지로 이동
    } catch (e: any) {
      alert(e.response?.data?.message || "회원가입 실패");
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>회원가입</h2>

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

        <button style={styles.button} onClick={register}>
          회원가입
        </button>

        {/* 🔥 로그인 페이지로 돌아가기 버튼 */}
        <button style={styles.loginButton} onClick={goToLogin}>
          로그인 페이지로 돌아가기
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
    backgroundColor: "#28a745", // 초록색
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  loginButton: {
    marginTop: "10px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#007bff", // 파란색
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
