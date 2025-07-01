import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-9EEY52MBRL'); // Replace with your Measurement ID
};

export const trackPage = (url) => {
  ReactGA.send({ hitType: 'pageview', page: url });
};

export const trackEvent = ({ category, action, label }) => {
  ReactGA.event({ category, action, label });
};
