import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPage } from '../utils/analytics';

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPage(location.pathname);
  }, [location.pathname]);

  return null;
};

export default RouteTracker;
