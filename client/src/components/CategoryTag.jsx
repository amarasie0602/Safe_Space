import { getCategoryMeta } from '../utils/categories';

const CategoryTag = ({ category }) => {
  const meta = getCategoryMeta(category);

  return (
    <span className={`badge tag-${meta.tone}`}>
      <span aria-hidden="true">{meta.icon}</span> {meta.label}
    </span>
  );
};

export default CategoryTag;
