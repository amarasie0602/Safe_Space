import Navbar from './Navbar';
import Footer from './Footer';
import SupportBanner from './SupportBanner';

const Layout = ({ children }) => (
  <>
    <SupportBanner />
    <Navbar />
    <main className="page">{children}</main>
    <Footer />
  </>
);

export default Layout;
