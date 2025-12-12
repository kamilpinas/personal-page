import React from 'react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { FiCheck, FiCopy } from 'react-icons/fi';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const { copy, copied } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(textToCopy)}
      aria-label="Copy to clipboard"
      className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/70 transition-colors duration-200"
    >
      {copied ? (
        <FiCheck className="w-5 h-5 text-green-400" />
      ) : (
        <FiCopy className="w-5 h-5" />
      )}
    </button>
  );
};

export default CopyButton;