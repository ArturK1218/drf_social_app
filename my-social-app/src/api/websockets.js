let socket = null;

export const connectChat = (dialogId, onMessage) => {
  if (socket) socket.close();

  const token = localStorage.getItem('access_token');
  const url = `ws://localhost:8000/ws/dialogs/${dialogId}/`;

  socket = new WebSocket(url);

  socket.onopen = () => console.log('WS подключён');
  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === 'chat_message') {
      onMessage({
        text: data.message,
        sender: data.sender,
        created_at: data.created_at,
      });
    }
  };
  socket.onerror = (err) => console.error('WS ошибка:', err);
  socket.onclose = () => (socket = null);
};

export const sendMessage = (text) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message: text }));
  }
};

export const disconnectChat = () => {
  if (socket) socket.close();
};