import {
  createContext,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { OutputMessage, WEBSOCKET_MSG } from '../../types';

const defaultState: OutputMessage = {
  note: 0,
  beat: 0,
  bar: 0,
  settings: {
    isRunning: false,
    bpm: 120,
    ticksPerBeat: 64,
    beatsPerBar: 4,
    beatUnit: 4,
  },
};

type WebSocketStatus = 'disconnected' | 'connected' | 'connecting';

interface UseWebSocketResult {
  state: WebSocketStatus;
  sendMessage: (message: WEBSOCKET_MSG) => void;
}

function useWebSocket(setState: (state: OutputMessage) => void): UseWebSocketResult {
  const [connectionState, setConnectionState] = useState<WebSocketStatus>('disconnected');
  const socket = useRef<WebSocket>();

  const sendMessage = useCallback((message: WEBSOCKET_MSG) => {
    if (socket.current) {
      socket.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (connectionState === 'disconnected') {
      setConnectionState('connecting');

      socket.current = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:6660');

      socket.current.onopen = function onSocketOpen() {
        setConnectionState('connected');
      };

      socket.current.onmessage = function onSocketMessage(ev) {
        try {
          const data: OutputMessage = JSON.parse(ev.data);

          setState(data);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      };

      socket.current.onclose = function onSocketClose() {
        setTimeout(() => setConnectionState('disconnected'), 1000);
      };

      socket.current.onerror = function onSocketError() {
        setTimeout(() => setConnectionState('disconnected'), 1000);
      };
    }
  }, [connectionState, setState]);

  return {
    state: connectionState,
    sendMessage,
  };
}

interface AppContext {
  state: OutputMessage;
  connectionState: WebSocketStatus;
  sendMessage: (message: WEBSOCKET_MSG) => void;
}

const defaultContext: AppContext = {
  state: defaultState,
  connectionState: 'disconnected',
  sendMessage: () => undefined,
};

export const appContext = createContext<AppContext>(defaultContext);

const AppContextProvider: FunctionComponent = ({ children }) => {
  const [state, setState] = useState<OutputMessage>(defaultState);
  const { state: connectionState, sendMessage } = useWebSocket(setState);

  return (
    <appContext.Provider value={{ state, connectionState, sendMessage }}>
      {children}
    </appContext.Provider>
  );
};

export default AppContextProvider;
