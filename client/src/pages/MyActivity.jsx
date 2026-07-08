import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSavedPostIds } from '../utils/savedPosts';
import { getSupportedThreads } from '../utils/supportedThreads';
import { getMyReplies } from '../utils/myReplies';

const TABS = ['My Posts', 'My Replies', 'Saved Posts', 'Supported Discussions'];

const MyActivity = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await api.get('/posts', { params: { limit: 50 } });
      setPosts(data.posts);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const myPosts = posts.filter((post) => post.author?._id === user.id);
  const savedPostIds = getSavedPostIds();
  const savedPosts = posts.filter((post) => savedPostIds.includes(post._id));
  const myReplies = getMyReplies();
  const supportedThreads = getSupportedThreads();

  return (
    <div>
      <h1>My Activity</h1>
      <p className="text-muted">
        Saved posts, replies, and supported discussions are tracked in this browser only and
        won't sync across devices.
      </p>
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

      {activeTab === 'My Replies' && (
        <>
          {myReplies.length === 0 && <div className="empty-state">No replies yet.</div>}
          {myReplies.map((reply) => (
            <Card key={reply._id}>
              <p>{reply.body}</p>
              <Link to={`/threads/${reply.threadId}`}>{reply.threadTitle}</Link>
            </Card>
          ))}
        </>
      )}

      {activeTab === 'Supported Discussions' && (
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
