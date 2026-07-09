import { useState } from 'react';
import Icon from '../components/Icon';
import GrowthIllustration from '../components/GrowthIllustration';
import { ARTICLES } from '../utils/inspiration';

const Inspiration = () => {
  const [openId, setOpenId] = useState(null);

  return (
    <div>
      <div className="static-page-illustration">
        <GrowthIllustration />
      </div>
      <h1>Healing Reads</h1>
      <p className="text-muted">
        Short, honest reads for the days you need something gentler than a blank page —
        self-compassion, rest, gratitude, and coping skills, written for SafeSpace.
      </p>

      <div className="article-list">
        {ARTICLES.map((article) => {
          const isOpen = openId === article.id;
          return (
            <div className="card article-card" key={article.id}>
              <button
                type="button"
                className="article-card-header"
                onClick={() => setOpenId(isOpen ? null : article.id)}
                aria-expanded={isOpen}
              >
                <div>
                  <div className="post-card-meta">
                    <span className="badge">{article.topic}</span>
                    <span className="text-muted">{article.readTime}</span>
                  </div>
                  <h2>{article.title}</h2>
                  <p className="text-muted">{article.excerpt}</p>
                </div>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} />
              </button>
              {isOpen && (
                <div className="article-card-body">
                  {article.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inspiration;
