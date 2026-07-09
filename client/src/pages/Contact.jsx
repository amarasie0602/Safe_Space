import StaticPage from '../components/StaticPage';
import Icon from '../components/Icon';

const Contact = () => (
  <StaticPage title="Contact">
    <div className="static-page-icon" aria-hidden="true">
      <Icon name="headphones" size={26} />
    </div>
    <p>
      Have a question, found a bug, or need to reach the SafeSpace team for something not covered
      by reporting a post?
    </p>
    <p>
      Email us at <a href="mailto:hello@safespace.example">hello@safespace.example</a>.
    </p>
    <p>
      For anything involving an immediate safety risk, please don't wait on an email — contact
      your local emergency service or a crisis line right away.
    </p>
  </StaticPage>
);

export default Contact;
