import { FunctionComponent, useContext } from 'react';

import StatusBar from '../StatusBar/StatusBar';
import Tracks from '../Tracks/Tracks';

import { appContext } from './AppContext';

const App: FunctionComponent = () => {
  const { connectionState } = useContext(appContext);

  if (connectionState !== 'connected') {
    return <div className="loading">Connecting to Jambox...</div>;
  }

  return (
    <>
      <StatusBar />
      <Tracks />
    </>
  );
};

export default App;
