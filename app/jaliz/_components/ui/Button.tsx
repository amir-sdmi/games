type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

const Button = ({ children, onClick, disabled = false }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="border border-green-500 bg-gray-200 rounded px-1 text-gray-700 disabled:bg-gray-400"
    >
      {children}
    </button>
  );
};
export default Button;
