import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Invoice } from '../types';
import StatusBadge from '../components/StatusBadge';
import { cn, formatCurrency } from '../lib/utils';
import { format } from 'date-fns';
import InvoiceForm from '../components/InvoiceForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { AnimatePresence } from 'motion/react';
import { getInvoiceById, saveInvoice, deleteInvoice as storageDeleteInvoice } from '../lib/storage';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = () => {
    if (!id) return;
    const found = getInvoiceById(id);
    if (found) {
      setInvoice(found);
    } else {
      navigate('/');
    }
  };

  const handleStatusUpdate = (status: 'paid') => {
    if (!invoice) return;
    const updatedInvoice = { ...invoice, status };
    saveInvoice(updatedInvoice);
    setInvoice(updatedInvoice);
  };

  const handleDelete = () => {
    if (!invoice) return;
    storageDeleteInvoice(invoice.id);
    navigate('/');
  };

  if (!invoice) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="flex items-center gap-6 font-bold text-sm mb-8 hover:text-text-02 w-fit group">
        <ChevronLeft size={16} className="text-primary" />
        Go Back
      </Link>

      <header className="flex items-center justify-between p-6 mb-6 bg-card-light dark:bg-card-dark rounded-lg shadow-sm sm:p-5 sm:px-8">
        <div className="flex items-center justify-between w-full sm:justify-start gap-5">
          <span className="text-sm text-[#858BB2] dark:text-slate-300">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center h-12 px-6 bg-[#F9FAFE] dark:bg-input-border-dark hover:bg-[#DFE3FA] dark:hover:bg-white dark:hover:text-[#7E88C3] text-[#7E88C3] font-bold text-xs rounded-full transition-all whitespace-nowrap"
          >
            Edit
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center justify-center h-12 px-6 bg-accent-red hover:bg-accent-red-light text-white font-bold text-xs rounded-full transition-all whitespace-nowrap"
          >
            Delete
          </button>
          {invoice.status !== 'paid' && (
            <button 
              onClick={() => handleStatusUpdate('paid')}
              className="flex items-center justify-center h-12 px-7 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-full transition-all whitespace-nowrap"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </header>

      <main className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-sm sm:p-12 mb-12 sm:mb-8">
        {/* Invoice ID & Description */}
        <div className="flex flex-col sm:flex-row sm:justify-between mb-8 sm:mb-5">
          <div className="mb-8 sm:mb-0">
            <h1 className="text-xl font-bold uppercase mb-1">
              <span className="text-text-03">#</span>{invoice.id}
            </h1>
            <p className="text-sm text-[#7E88C3]">{invoice.description}</p>
          </div>
          <div className="text-xs text-[#7E88C3] text-left sm:text-right font-medium leading-5">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        {/* Client & Date Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-sm text-[#7E88C3] mb-3">Invoice Date</h3>
              <p className="text-lg font-bold">{format(new Date(invoice.createdAt), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <h3 className="text-sm text-[#7E88C3] mb-3">Payment Due</h3>
              <p className="text-lg font-bold">{format(new Date(invoice.paymentDue), 'dd MMM yyyy')}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-[#7E88C3] mb-3">Bill To</h3>
            <p className="text-lg font-bold mb-2">{invoice.clientName}</p>
            <div className="text-xs text-[#7E88C3] leading-5 font-medium">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm text-[#7E88C3] mb-3">Sent to</h3>
            <p className="text-lg font-bold truncate">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="bg-[#F9FAFE] dark:bg-input-border-dark rounded-t-lg p-6 sm:p-8 sm:pb-4">
          {/* Desktop Headers */}
          <div className="hidden sm:grid grid-cols-5 gap-4 mb-8 text-xs text-[#7E88C3] font-medium">
            <span className="col-span-2">Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>

          {/* Items */}
          <div className="space-y-8 sm:space-y-6">
            {invoice.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center sm:grid sm:grid-cols-5 gap-4">
                <div className="flex flex-col sm:col-span-2">
                  <span className="font-bold text-sm mb-2 sm:mb-0">{item.name}</span>
                  <span className="sm:hidden text-sm font-bold text-[#7E88C3]">
                    {item.quantity} x {formatCurrency(item.price)}
                  </span>
                </div>
                <span className="hidden sm:block text-center font-bold text-sm text-[#7E88C3]">
                  {item.quantity}
                </span>
                <span className="hidden sm:block text-right font-bold text-sm text-[#7E88C3]">
                  {formatCurrency(item.price)}
                </span>
                <span className="font-bold text-sm text-right">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grand Total */}
        <div className="bg-[#373B53] dark:bg-black rounded-b-lg p-6 px-8 flex items-center justify-between text-white">
          <span className="text-xs font-medium">Amount Due</span>
          <span className="text-2xl font-bold tracking-tight">{formatCurrency(invoice.total)}</span>
        </div>
      </main>

      {/* Mobile Footer Actions */}
      <footer className="fixed bottom-0 left-0 w-full p-6 bg-white dark:bg-card-dark flex items-center justify-center gap-2 sm:hidden shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center h-12 px-6 bg-[#F9FAFE] dark:bg-input-border-dark hover:bg-[#DFE3FA] dark:hover:bg-white dark:hover:text-[#7E88C3] text-[#7E88C3] font-bold text-xs rounded-full transition-all whitespace-nowrap"
        >
          Edit
        </button>
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center justify-center h-12 px-6 bg-accent-red hover:bg-accent-red-light text-white font-bold text-xs rounded-full transition-all whitespace-nowrap"
        >
          Delete
        </button>
        {invoice.status !== 'paid' && (
          <button 
            onClick={() => handleStatusUpdate('paid')}
            className="flex items-center justify-center h-12 px-7 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-full transition-all whitespace-nowrap"
          >
            Mark as Paid
          </button>
        )}
      </footer>

      <AnimatePresence>
        {isFormOpen && (
          <InvoiceForm 
            existingInvoice={invoice}
            onClose={() => setIsFormOpen(false)} 
            onSave={() => {
              setIsFormOpen(false);
              fetchInvoice();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <ConfirmDeleteModal 
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            invoiceId={invoice.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
