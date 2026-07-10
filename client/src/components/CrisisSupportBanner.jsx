import { Link } from 'react-router-dom';
import Icon from './Icon';

const CrisisSupportBanner = () => (
  <div className="crisis-support-banner" role="status">
    <Icon name="heart" size={16} />
    <div>
      <strong>It sounds like you might be going through a lot right now.</strong>
      <p>
        You're not alone, and support is available. Take a look at our{' '}
        <Link to="/crisis-resources" target="_blank" rel="noopener noreferrer">
          Crisis Resources
        </Link>{' '}
        if you need to talk to someone right now. You can still share here whenever you're ready.
      </p>
    </div>
  </div>
);

export default CrisisSupportBanner;
