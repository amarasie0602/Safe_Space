import { Link } from 'react-router-dom';
import Icon from './Icon';
import { getTodaysAffirmation } from '../utils/affirmations';

const DailyAffirmation = () => (
  <div className="daily-affirmation">
    <span className="daily-affirmation-icon" aria-hidden="true">
      <Icon name="sun" size={18} />
    </span>
    <p>{getTodaysAffirmation()}</p>
    <Link to="/inspiration" className="daily-affirmation-link">
      More healing reads <Icon name="chevron-down" size={13} className="daily-affirmation-chevron" />
    </Link>
  </div>
);

export default DailyAffirmation;
