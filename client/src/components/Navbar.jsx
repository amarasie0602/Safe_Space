import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Posts</Link>
      <Link to="/threads">Threads</Link>
      <Link to="/counselors">Counselors</Link>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
      {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
    </nav>
  );
};

export default Navbar;
