import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useVisibilityTracking from '../src/index';

const sleepingCatImage = require('./assets/sleeping-cat.png');
const awakeCatImage = require('./assets/awake-cat.png');
const moonImage = require('./assets/moon.png');
const sunImage = require('./assets/sun.png');

const containerStyle = {
  height: '180vh',
  width: '100%',
  fontFamily: "'Montserrat', sans-serif",
};
const informationContainer = {
  position: 'fixed',
  top: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
  marginRight: '10px',
};
const informationSection = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  margin: '10px',
};
const informationHeader = {
  marginBottom: '10px',
  fontWeight: 700,
};
const catBoxStyle = {
  width: '350px',
  height: '400px',
  position: 'absolute',
  top: '120vh',
  left: '50%',
  marginLeft: '-175px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  marginBottom: '30px',
};
const catImageStyle = {
  width: '150px',
  height: '150px',
};
const moonContainer = {
  position: 'fixed',
  top: '25%',
  left: '50%',
  marginLeft: '-50px',
};
const sunContainer = {
  position: 'fixed',
  top: '25%',
  left: '-50%',
  marginLeft: '-50px',
};
const weatherImageStyle = {
  width: '100px',
  height: '100px',
};
const App = () => {
  const [ref, { isVisible, percentVisible, rect }] = useVisibilityTracking();

  const catImage = isVisible ? awakeCatImage : sleepingCatImage;
  const catText = isVisible ? 'Oops... I am VISIBLE !?' : ' ';
  const catBoxBorderStyle = isVisible
    ? {
        border: '5px solid transparent',
        borderImage:
          'linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)',
        borderImageSlice: 1,
      }
    : {
        border: '5px solid #f4f4f4',
      };
  const scaledColor = 255 * percentVisible.overallPercent;
  const inversedScaledColor = 255 - scaledColor;
  const backgroundColor = `rgb(${scaledColor}, ${scaledColor}, ${scaledColor})`;
  const textColor = `rgb(${inversedScaledColor}, ${inversedScaledColor}, ${inversedScaledColor})`;
  const weatherImagePosition = `${window.innerWidth *
    percentVisible.verticalPercent}%`;

  return (
    <div style={{ ...containerStyle, backgroundColor: backgroundColor }}>
      <div style={informationContainer}>
        <div style={{ ...informationSection, color: textColor }}>
          <span style={informationHeader}>Percent Visible: </span>
          <span>Horizontal: {percentVisible.horizontalPercent.toFixed(2)}</span>
          <span>Vertical: {percentVisible.verticalPercent.toFixed(2)}</span>
          <span>Overall: {percentVisible.overallPercent.toFixed(2)}</span>
        </div>
        <div style={{ ...informationSection, color: textColor }}>
          <span style={informationHeader}>Element Rect: </span>
          {rect !== null ? (
            <>
              <span>x: {rect.x}</span>
              <span>y: {rect.y}</span>
              <span>width: {rect.width}</span>
              <span>height: {rect.height}</span>
              <span>top: {rect.top}</span>
              <span>right: {rect.right}</span>
              <span>bottom: {rect.bottom}</span>
              <span>left: {rect.left}</span>
            </>
          ) : (
            <span>null</span>
          )}
        </div>
      </div>
      <div></div>
      <div
        style={{
          ...moonContainer,
          transition: '1s ease-out',
          transform: `translateX(${weatherImagePosition})`,
        }}
      >
        <img src={moonImage} style={weatherImageStyle}></img>
      </div>
      <div
        style={{
          ...sunContainer,
          transition: '1s ease-out',
          transform: `translateX(${weatherImagePosition})`,
        }}
      >
        <img src={sunImage} style={weatherImageStyle}></img>
      </div>
      <div style={{ ...catBoxStyle, ...catBoxBorderStyle }} ref={ref}>
        <h3>{catText}</h3>
        <img src={catImage} style={catImageStyle}></img>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
