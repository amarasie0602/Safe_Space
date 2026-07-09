import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import PostFeed from './pages/PostFeed';
import CreatePost from './pages/CreatePost';
import ThreadList from './pages/ThreadList';
import ThreadDetail from './pages/ThreadDetail';
import CreateThread from './pages/CreateThread';
import CounselorList from './pages/CounselorList';
import CounselorProfile from './pages/CounselorProfile';
import Inspiration from './pages/Inspiration';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import CommunityGuidelines from './pages/CommunityGuidelines';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CrisisResources from './pages/CrisisResources';
import MyActivity from './pages/MyActivity';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import FlaggedPostsQueue from './pages/admin/FlaggedPostsQueue';
import ReportsQueue from './pages/admin/ReportsQueue';
import CounselorVerificationList from './pages/admin/CounselorVerificationList';
import AdminBookings from './pages/admin/AdminBookings';
import AnalyticsView from './pages/admin/AnalyticsView';
import PrivateRoute from './context/PrivateRoute';
import AdminRoute from './context/AdminRoute';
import CounselorLogin from './pages/CounselorLogin';
import CounselorDashboard from './pages/CounselorDashboard';
import CounselorPrivateRoute from './context/CounselorPrivateRoute';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PostFeed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/counselors" element={<CounselorList />} />
        <Route path="/counselors/:id" element={<CounselorProfile />} />
        <Route path="/counselor-login" element={<CounselorLogin />} />
        <Route
          path="/counselor/bookings"
          element={
            <CounselorPrivateRoute>
              <CounselorDashboard />
            </CounselorPrivateRoute>
          }
        />
        <Route path="/guidelines" element={<CommunityGuidelines />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/crisis-resources" element={<CrisisResources />} />
        <Route
          path="/my-activity"
          element={
            <PrivateRoute>
              <MyActivity />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
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
