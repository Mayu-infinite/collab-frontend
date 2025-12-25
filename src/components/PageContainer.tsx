import './PageContainer.css';

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-container">
      <div className="page-inner">
        {children}
      </div>
    </div>
  );
}
