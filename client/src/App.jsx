import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import PostFeed from './pages/PostFeed';
import CreatePost from './pages/CreatePost';
import ThreadList from './pages/ThreadList';
import ThreadDetail from './pages/ThreadDetail';
import CreateThread from './pages/CreateThread';
import CounselorList from './pages/CounselorList';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import FlaggedPostsQueue from './pages/admin/FlaggedPostsQueue';
import ReportsQueue from './pages/admin/ReportsQueue';
import CounselorVerificationList from './pages/admin/CounselorVerificationList';
import AdminBookings from './pages/admin/AdminBookings';
import AnalyticsView from './pages/admin/AnalyticsView';
import PrivateRoute from './context/PrivateRoute';
import AdminRoute from './context/AdminRoute';

function App() {
  return (
    <Layout>
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
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route path="posts" element={<FlaggedPostsQueue />} />
          <Route path="reports" element={<ReportsQueue />} />
          <Route path="counselors" element={<CounselorVerificationList />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="analytics" element={<AnalyticsView />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
