interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export default function Button({ text, onClick, className = "", variant = 'primary' }: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'secondary':
        return 'bg-yellow-400 hover:bg-yellow-500 text-gray-800';
      case 'tertiary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      default:
        return 'bg-green-600 hover:bg-green-700 text-white';
    }
  };

  return (
    <button 
      className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${getVariantStyles()} ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
