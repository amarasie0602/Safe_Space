import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { SavedPostsContext } from '../context/SavedPostsContext';
import PostCard from '../components/PostCard';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const TABS = ['My Posts', 'My Replies', 'Saved Posts', 'Supported Discussions'];

const MyActivity = () => {
  const { user } = useContext(AuthContext);
  const { savedPosts } = useContext(SavedPostsContext);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [posts, setPosts] = useState([]);
  const [myReplies, setMyReplies] = useState([]);
  const [supportedThreads, setSupportedThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [postsRes, repliesRes, supportedRes] = await Promise.all([
        api.get('/posts', { params: { limit: 50 } }),
        api.get('/auth/me/replies'),
        api.get('/threads/mine/supported'),
      ]);
      setPosts(postsRes.data.posts);
      setMyReplies(repliesRes.data);
      setSupportedThreads(supportedRes.data);
      setLoading(false);
    };
    fetchAll();
  }, []);

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
    </div>
  );
};

export default MyActivity;
