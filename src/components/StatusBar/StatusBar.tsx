import { FunctionComponent } from 'react';

import PlayControls from './PlayControls';
import TimeBox from './TimeBox';

import './StatusBar.css';

const StatusBar: FunctionComponent = () => (
  <div className="StatusBar">
    <PlayControls />
    <TimeBox />
  </div>
);

export default StatusBar;
