import { Route, Routes } from 'react-router-dom';
import PostFeed from './pages/PostFeed';
import CreatePost from './pages/CreatePost';
import ThreadList from './pages/ThreadList';
import ThreadDetail from './pages/ThreadDetail';
import CreateThread from './pages/CreateThread';
import CounselorList from './pages/CounselorList';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './context/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostFeed />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/posts/new"
        element={
          <PrivateRoute>
            <CreatePost />
          </PrivateRoute>
        }
      />
      <Route path="/threads" element={<ThreadList />} />
      <Route
        path="/threads/new"
        element={
          <PrivateRoute>
            <CreateThread />
          </PrivateRoute>
        }
      />
      <Route path="/threads/:id" element={<ThreadDetail />} />
      <Route path="/counselors" element={<CounselorList />} />
    </Routes>
  );
}

export default App;
