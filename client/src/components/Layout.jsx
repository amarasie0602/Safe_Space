import Navbar from './Navbar';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="crisis-banner" role="alert">
      <span aria-hidden="true">💜</span>
      If you're in crisis, you don't have to face it alone — call 988 (US) or your local
      emergency number now.
    </div>
    <main className="page">{children}</main>
  </>
);

export default Layout;
