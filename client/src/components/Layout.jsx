import Navbar from './Navbar';

const bannerStyle = {
  backgroundColor: '#b91c1c',
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '0.75rem',
};

const Layout = ({ children }) => (
  <div>
    <Navbar />
    <div role="alert" style={bannerStyle}>
      If you are in crisis, call 988 (US) or your local emergency number now.
    </div>
    <main>{children}</main>
  </div>
);

export default Layout;
