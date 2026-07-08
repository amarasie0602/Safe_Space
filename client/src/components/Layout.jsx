import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="crisis-banner" role="alert">
      SafeSpace is not a substitute for emergency services. If you're in crisis, please contact
      your local emergency number.
    </div>
    <main className="page">{children}</main>
    <Footer />
  </>
);

export default Layout;
