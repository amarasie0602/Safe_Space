import logo from '../assets/logo-icon.png';

const AuthCard = ({ title, subtitle, children }) => (
  <div className="auth-card">
    <div className="auth-card-brand">
      <img src={logo} alt="SafeSpace" />
    </div>
    <h1>{title}</h1>
    {subtitle && <p className="text-muted auth-card-subtitle">{subtitle}</p>}
    {children}
  </div>
);

export default AuthCard;
