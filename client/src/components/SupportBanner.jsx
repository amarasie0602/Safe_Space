import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const STORAGE_KEY = 'supportBannerCollapsed';

const SupportBanner = () => {
  const [collapsed, setCollapsed] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1');

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    sessionStorage.setItem(STORAGE_KEY, next ? '1' : '0');
  };

  return (
    <div className={`support-banner${collapsed ? ' collapsed' : ''}`}>
      <div className="support-banner-content">
        <Icon name="headphones" size={20} />
        <div className="support-banner-text">
          <strong>Need immediate support?</strong>
          <span>Professional resources and support are available whenever you need them.</span>
        </div>
      </div>
      <div className="support-banner-actions">
        <Link to="/crisis-resources" className="btn btn-primary btn-sm">
          View Support Resources
        </Link>
        <button
          type="button"
          className="support-banner-toggle"
          onClick={toggle}
          aria-label={collapsed ? 'Expand support banner' : 'Collapse support banner'}
          title={collapsed ? 'Expand support banner' : 'Collapse support banner'}
        >
          <Icon name={collapsed ? 'chevron-down' : 'chevron-up'} size={16} />
        </button>
      </div>
    </div>
  );
};

export default SupportBanner;
