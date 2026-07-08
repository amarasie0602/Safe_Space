const StaticPage = ({ title, children }) => (
  <div className="static-page">
    <h1>{title}</h1>
    {children}
  </div>
);

export default StaticPage;
