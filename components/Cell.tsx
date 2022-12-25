const Cell = ({ children, className = "", ...props }: any) => {
  return (
    <div className={`cell ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Cell;
