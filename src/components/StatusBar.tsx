import { FunctionComponent } from 'react';

import PlayControls from './PlayControls';
import TimeBox from './TimeBox';

const StatusBar: FunctionComponent = () => {
  const t = 1;

  return (
    <div className="StatusBar">
      <PlayControls />
      <TimeBox />
    </div>
  );
};

export default StatusBar;
