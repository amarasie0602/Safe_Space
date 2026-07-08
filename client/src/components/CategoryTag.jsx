import { getCategoryMeta } from '../utils/categories';
import Icon from './Icon';

const CategoryTag = ({ category }) => {
  const meta = getCategoryMeta(category);

  return (
    <span className={`badge tag-${meta.tone}`}>
      <Icon name={meta.icon} size={13} /> {meta.label}
    </span>
  );
};

export default CategoryTag;
