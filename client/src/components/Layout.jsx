import Navbar from './Navbar';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="crisis-banner" role="alert">
      If you are in crisis, call 988 (US) or your local emergency number now.
    </div>
    <main className="page">{children}</main>
  </>
);

export default Layout;
