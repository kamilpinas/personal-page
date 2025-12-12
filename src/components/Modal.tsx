import React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-5/6 w-5/6">
        <button
          onClick={onClose}
          className="absolute z-50 text-5xl top-4 right-4 text-gray-500 hover:text-gray-200"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
