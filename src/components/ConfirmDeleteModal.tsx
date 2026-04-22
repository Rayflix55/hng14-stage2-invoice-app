import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface ConfirmDeleteModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  invoiceId: string;
}

export default function ConfirmDeleteModal({ onCancel, onConfirm, invoiceId }: ConfirmDeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/50"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md p-8 bg-white dark:bg-dark-card shadow-2xl rounded-lg z-10 sm:p-12"
      >
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-sm text-text-secondary dark:text-slate-300 leading-6 mb-4">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-2">
          <button 
            onClick={onCancel}
            className="px-6 py-4 bg-light-bg dark:bg-[#252945] hover:bg-border dark:hover:bg-slate-700 text-text-secondary font-bold text-sm rounded-full transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-4 bg-red-500 hover:bg-red-400 text-white font-bold text-sm rounded-full transition-all"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
