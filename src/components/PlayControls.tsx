import { FunctionComponent, useContext } from 'react';

import { appContext } from './AppContext';

const PlayControls: FunctionComponent = () => {
  const { state: { settings: { isRunning } }, sendMessage } = useContext(appContext);

  return (
    <div className="PlayControls">
      {!isRunning && (
        <button className="PlayControls__Play" type="button" onClick={() => sendMessage({ type: 'START' })}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 125 125">
            <path
              d="M107.6,54.1L28.8,1.7C22.1-2.8,13,2.1,13,10.1v104.7c0,8.2,9.1,12.9,15.8,8.4l78.8-52.4C113.5,67,113.5,58.1,107.6,54.1z"
            />
          </svg>
        </button>
      )}
      {isRunning && (
        <button className="PlayControls__Stop" type="button" onClick={() => sendMessage({ type: 'STOP' })}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" x="0px" y="0px">
            <rect x="0" y="0" width="22" height="22" rx="4.44" ry="4.44" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PlayControls;
