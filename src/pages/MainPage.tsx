import { useEffect, useState, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

export default function AgentPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const clientRef = useRef<any>(null);
  
  useEffect(() => {
    const socket = new SockJS("http://localhost:8443/ws");
    const client = Stomp.over(socket);
    clientRef.current = client;

    client.connect({}, () => {
      console.log("WS connected");

      client.subscribe("/topic/agent", (msg) => {
        let body = msg.body;
        try {
          body = JSON.parse(msg.body);
        } catch {}
        setMessages((prev) => [...prev, `${body.userId}: ${body.content}`]);
      });
    });

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.disconnect(() => console.log("WS disconnected"));
      }
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>상담사 화면</h1>
      {messages.map((m, idx) => (
        <div key={idx}>{m}</div>
      ))}
    </div>
  );
}
