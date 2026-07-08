import StaticPage from '../components/StaticPage';

const Privacy = () => (
  <StaticPage title="Privacy Policy">
    <p>
      SafeSpace is built around anonymity. Regular users register with a nickname and password
      only — no real name, email, or phone number is ever collected.
    </p>
    <h2>What we store</h2>
    <ul>
      <li>Your nickname and a securely hashed password (never your plain-text password)</li>
      <li>The content of posts, threads, and replies you create</li>
      <li>Counselor accounts additionally provide a name and email, since they carry professional credentials</li>
    </ul>
    <h2>What we don't do</h2>
    <ul>
      <li>We don't sell or share your data with third parties</li>
      <li>We don't ask for or store real names, addresses, or payment details for regular users</li>
    </ul>
  </StaticPage>
);

export default Privacy;
