function setDataInUI(data, prefix = '') {
  Object.keys(data).forEach(function renderProperty(key) {
    const value = data[key];
    const elementKey = [prefix, key].filter((x) => !!x).join('-');

    if (typeof value === 'string' || typeof value === 'number') {
      const element = document.getElementById(`attr-${elementKey}`);

      if (element && element.innerHTML !== value) {
        element.innerHTML = value;
      }
    } else if (typeof value === 'boolean') {
      const elementTrue = document.getElementById(`attr-${elementKey}-true`);
      const elementFalse = document.getElementById(`attr-${elementKey}-false`);

      if (elementTrue) {
        elementTrue.style.display = value ? 'block' : 'none';
      }

      if (elementFalse) {
        elementFalse.style.display = !value ? 'block' : 'none';
      }
    } else if (typeof value === 'object') {
      setDataInUI(value, elementKey);
    }
  });
}

let connectionState = 'disconnected'; // disconnected, connecting, connected

window.socket = undefined;

function sendMessage(data) {
  window.socket.send(JSON.stringify(data));
}

function connectToWebSocket() {
  connectionState = 'connecting';

  document.body.classList.remove('connected');
  document.body.classList.add('connecting');

  window.socket = new WebSocket('ws://localhost:6660');

  window.socket.onopen = function onSocketOpen() {
    connectionState = 'connected';

    document.body.classList.remove('connecting');
    document.body.classList.add('connected');
  };

  window.socket.onmessage = function onSocketMessage(ev) {
    try {
      const data = JSON.parse(ev.data);

      setDataInUI(data);
    } catch (err) {
      console.error(err);
    }
  }

  window.socket.onclose = function onSocketClose() {
    connectionState = 'disconnected';
    document.body.classList.remove('connected');
  };

  window.socket.onerror = function onSocketError() {
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
