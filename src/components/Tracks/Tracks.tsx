import { FunctionComponent } from 'react';

import './Tracks.css';

const Tracks: FunctionComponent = () => {
  const t = 1;

  return (
    <div className="Tracks">
      <div className="Track">
        <div className="TrackType TrackOption TrackOption">
          <div className="Track__Header Track__Header--bold">Track #1</div>
          <select name="type">
            <option selected>Generated</option>
            <option>Sequence</option>
          </select>
        </div>
        <div className="TrackInterval TrackOption">
          <div className="Track__Header">Rate</div>
          <select name="speed">
            <option selected>1/1</option>
            <option>1/2</option>
            <option>1/4</option>
            <option>1/8</option>
            <option>1/16</option>
            <option>1/32</option>
            <option>1/64</option>
          </select>
        </div>
        <div className="TrackGate TrackOption">
          <div className="Track__Header">
            Gate
          </div>
          <select name="gate">
            <option>0%</option>
            <option>10%</option>
            <option>20%</option>
            <option>30%</option>
            <option>40%</option>
            <option selected>50%</option>
            <option>60%</option>
            <option>70%</option>
            <option>80%</option>
            <option>90%</option>
            <option>100%</option>
          </select>
        </div>
        <div className="TrackInterval TrackOption">
          <div className="Track__Header">Oct</div>
          <select name="oct">
            <option>8</option>
            <option>7</option>
            <option>6</option>
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option selected>2</option>
            <option>1</option>
            <option>0</option>
            <option>-1</option>
            <option>-2</option>
          </select>
        </div>
        <div className="TrackInterval TrackOption">
          <div className="Track__Header">Scale</div>
          <select name="scale-note">
            <option>C</option>
            <option>C#</option>
            <option>D</option>
            <option>D#</option>
            <option>Eb</option>
            <option>E</option>
            <option>F</option>
            <option>F#</option>
            <option>G</option>
            <option>G#</option>
            <option>Ab</option>
            <option>A</option>
            <option>A#</option>
            <option>Bb</option>
            <option>B</option>
          </select>
          <select name="scale">
            <option disabled>Scale</option>
            <option>Major</option>
            <option selected>Minor</option>
            <option>Minor Pentatonic</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Tracks;
