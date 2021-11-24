import { FunctionComponent, useContext } from 'react';

import { appContext } from './AppContext';
import StatusBar from './StatusBar';

const App: FunctionComponent = () => {
  const { connectionState } = useContext(appContext);

  if (connectionState !== 'connected') {
    return <div className="loading">Connecting to Jambox...</div>;
  }

  return (
    <>
      <StatusBar />
    </>
  );
};

export default App;
