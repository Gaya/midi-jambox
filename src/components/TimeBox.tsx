import { FunctionComponent, useContext } from 'react';

import { appContext } from './AppContext';

const TimeBox: FunctionComponent = () => {
  const { state: { bar, beat, settings: { bpm, beatsPerBar, beatUnit } } } = useContext(appContext);

  return (
    <table className="TimeBox">
      <tbody>
        <tr>
          <td className="TimeBox__Bar">
            <span className="TimeBox__value">{bar}</span>
            <span className="TimeBox__label">Bar</span>
          </td>
          <td className="TimeBox__Beat">
            <span className="TimeBox__value">{beat}</span>
            <span className="TimeBox__label">Beat</span>
          </td>
          <td className="TimeBox__BPM">
            <span className="TimeBox__value--small">{bpm}</span>
            <span className="TimeBox__label">BPM</span>
          </td>
          <td className="TimeBox__Signature">
            <span className="TimeBox__value--small">{`${beatsPerBar}/${beatUnit}`}</span>
            <span className="TimeBox__label">&nbsp;</span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TimeBox;
