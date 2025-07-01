import React, { useEffect } from 'react';
import { trackEvent } from '../utils/analytics';
import { Helmet } from 'react-helmet';

const TechRedirect = () => {
  useEffect(() => {
    trackEvent({
      category: 'Navigation',
      action: 'Redirect to StillTraNequa.com',
      label: 'User clicked Tech Button'
    })

    const timer = setTimeout(() => {
      window.location.href = 'https://stilltranequa.com';
    }, 3000); // Delay redirect by 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Tech Services by StillTranequa | Web Design & Development</title>
        <meta name="description" content="Explore full-stack web development, mobile apps, web design, automations, and digital strategy by NeNe — architected with beauty and scalability in mind." />
      </Helmet>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Hold on 👋🏾</h1>
        <p>You're about to leave NeNeTheArchitect.com and head to my full tech portfolio at StillTranequa.com.</p>
        <p>If you’re not redirected automatically, <a href="https://stilltranequa.com">click here</a>.</p>
      </div>
    </>

  );
};

export default TechRedirect;
