import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CounselorAuthContext } from './CounselorAuthContext';

const CounselorPrivateRoute = ({ children }) => {
  const { counselor } = useContext(CounselorAuthContext);

  if (!counselor) {
    return <Navigate to="/counselor-login" replace />;
  }

  return children;
};

export default CounselorPrivateRoute;
