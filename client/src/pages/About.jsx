import StaticPage from '../components/StaticPage';
import GrowthIllustration from '../components/GrowthIllustration';

const About = () => (
  <StaticPage title="About SafeSpace">
    <div className="static-page-illustration">
      <GrowthIllustration />
    </div>
    <p>
      SafeSpace is a peer support platform built so people can share what they're going through —
      mental health, family, financial stress, relationships, and more — without giving up their
      privacy to do it.
    </p>
    <p>
      Posts and threads are pseudonymous by design. Verified counselors are available for those
      who want professional guidance, and every space is watched over by moderators who keep
      things safe and respectful.
    </p>
    <p>SafeSpace was built as a university project exploring what a genuinely trustworthy anonymous support community could look like.</p>
  </StaticPage>
);

export default About;
