import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div>
    <Navbar />
    <div role="alert">If you are in crisis, call 988 (US) or your local emergency number now.</div>
    <main>{children}</main>
  </div>
);

export default Layout;
