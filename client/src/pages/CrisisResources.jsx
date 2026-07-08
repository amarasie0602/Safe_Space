import StaticPage from '../components/StaticPage';

const CrisisResources = () => (
  <StaticPage title="Crisis Resources">
    <p>
      If you're in immediate danger, please contact your local emergency service right away.
      Below are additional resources if you need someone to talk to right now.
    </p>
    <h2>United States</h2>
    <ul>
      <li>988 Suicide &amp; Crisis Lifeline — call or text 988</li>
      <li>Crisis Text Line — text HOME to 741741</li>
    </ul>
    <h2>International</h2>
    <ul>
      <li>Find a helpline in your country at findahelpline.com</li>
    </ul>
    <p>
      SafeSpace's peer community and counselors are here for ongoing support, but they are not a
      substitute for emergency care in a crisis.
    </p>
  </StaticPage>
);

export default CrisisResources;
