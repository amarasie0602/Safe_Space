import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { SavedPostsContext } from '../context/SavedPostsContext';
import { ToastContext } from '../context/ToastContext';
import PostCard from '../components/PostCard';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const TABS = ['My Posts', 'My Replies', 'Saved Posts', 'Supported Discussions', 'My Bookings'];

const ReviewForm = ({ booking, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useContext(ToastContext);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post(`/bookings/${booking._id}/review`, { rating, comment });
      showToast('Thanks for your feedback!');
      onSubmitted(booking._id);
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to submit your review right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-meta review-item">
      <div className="time-slots">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`tab${rating === n ? ' active' : ''}`}
            onClick={() => setRating(n)}
          >
            {n}★
          </button>
        ))}
      </div>
      <label className="field">
        Comment (optional)
        <textarea value={comment} onChange={(e) => setComment(e.target.value.slice(0, 500))} rows={2} />
      </label>
      <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit review'}
      </button>
    </div>
  );
};

const MyActivity = () => {
  const { user } = useContext(AuthContext);
  const { savedPosts } = useContext(SavedPostsContext);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [posts, setPosts] = useState([]);
  const [myReplies, setMyReplies] = useState([]);
  const [supportedThreads, setSupportedThreads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [postsRes, repliesRes, supportedRes, bookingsRes] = await Promise.all([
        api.get('/posts', { params: { limit: 50 } }),
        api.get('/auth/me/replies'),
        api.get('/threads/mine/supported'),
        api.get('/bookings/mine-as-client'),
      ]);
      setPosts(postsRes.data.posts);
      setMyReplies(repliesRes.data);
      setSupportedThreads(supportedRes.data);
      setBookings(bookingsRes.data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleReviewed = (bookingId) => {
    setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, reviewed: true } : b)));
  };

  const myPosts = posts.filter((post) => post.author?._id === user.id);

  return (
    <div>
      <h1>My Activity</h1>
      <p className="text-muted">Everything here syncs with your account across devices.</p>
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner />}

      {!loading && activeTab === 'My Posts' && (
        <>
          {myPosts.length === 0 && <div className="empty-state">You haven't posted yet.</div>}
          {myPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </>
      )}

      {!loading && activeTab === 'Saved Posts' && (
        <>
          {savedPosts.length === 0 && (
            <div className="empty-state">No saved posts yet. Use the bookmark icon on a post to save it.</div>
          )}
          {savedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </>
      )}

      {!loading && activeTab === 'My Replies' && (
        <>
          {myReplies.length === 0 && <div className="empty-state">No replies yet.</div>}
          {myReplies.map((reply) => (
            <Card key={reply._id}>
              <p>{reply.body}</p>
              {reply.thread ? (
                <Link to={`/threads/${reply.thread._id}`}>{reply.thread.title}</Link>
              ) : (
                <span className="text-muted">Reply on a post</span>
              )}
            </Card>
          ))}
        </>
      )}

      {!loading && activeTab === 'Supported Discussions' && (
        <>
          {supportedThreads.length === 0 && (
            <div className="empty-state">You haven't supported any threads yet.</div>
          )}
          {supportedThreads.map((thread) => (
            <Card key={thread._id}>
              <Link to={`/threads/${thread._id}`}>{thread.title}</Link>
            </Card>
          ))}
        </>
      )}

      {!loading && activeTab === 'My Bookings' && (
        <>
          {bookings.length === 0 && (
            <div className="empty-state">
              No bookings yet. <Link to="/counselors">Find a counselor</Link> to book an anonymous session.
            </div>
          )}
          {bookings.map((booking) => (
            <Card key={booking._id}>
              <p>
                <strong>{booking.counselor?.name}</strong> —{' '}
                {new Date(booking.requestedTime).toLocaleString()}
              </p>
              <div className="card-meta">
                <span className={`badge${booking.status === 'cancelled' ? ' badge-danger' : ''}`}>
                  {booking.status}
                </span>
              </div>
              {booking.status === 'completed' && !booking.reviewed && (
                <ReviewForm booking={booking} onSubmitted={handleReviewed} />
              )}
              {booking.status === 'completed' && booking.reviewed && (
                <p className="text-muted">You've reviewed this session.</p>
              )}
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default MyActivity;
