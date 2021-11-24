function setDataInUI(data, prefix = '') {
  Object.keys(data).forEach(function renderProperty(key) {
    const value = data[key];
    const elementKey = [prefix, key].filter((x) => !!x).join('-');

    if (typeof value === 'string' || typeof value === 'number') {
      const element = document.getElementById(`attr-${elementKey}`);

      if (element && element.innerHTML !== value) {
        element.innerHTML = value;
      }
    } else if (typeof value === 'object') {
      setDataInUI(value, elementKey);
    }
  });
}

let connectionState = 'disconnected'; // disconnected, connecting, connected

function connectToWebSocket() {
  connectionState = 'connecting';

  document.body.classList.remove('connected');
  document.body.classList.add('connecting');

  const socket = new WebSocket('ws://localhost:6660');

  socket.onopen = function onSocketOpen() {
    connectionState = 'connected';

    document.body.classList.remove('connecting');
    document.body.classList.add('connected');
  };

  socket.onmessage = function onSocketMessage(ev) {
    try {
      const data = JSON.parse(ev.data);

      setDataInUI(data);
    } catch (err) {
      console.error(err);
    }
  }

  socket.onclose = function onSocketClose() {
    connectionState = 'disconnected';
    document.body.classList.remove('connected');
  };

  socket.onerror = function onSocketError() {
    connectionState = 'disconnected';
    document.body.classList.remove('connected');
  };
}

document.addEventListener('DOMContentLoaded', function onDocumentLoad() {
  setInterval(() => {
    if (connectionState === 'disconnected') {
      connectToWebSocket();
    }
  }, 1000);
});
