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

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    const res = await fetch(`/api/invoices`);
    const data = await res.json();
    const found = data.find((inv: Invoice) => inv.id === id);
    if (found) {
      setInvoice(found);
    } else {
      navigate('/');
    }
  };

  const handleStatusUpdate = async (status: 'paid') => {
    if (!invoice) return;
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...invoice, status }),
    });
    if (res.ok) {
      fetchInvoice();
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      navigate('/');
    }
  };

  if (!invoice) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="flex items-center gap-6 font-bold text-sm mb-8 hover:text-text-02 w-fit group">
        <ChevronLeft size={16} className="text-primary" />
        Go Back
      </Link>

      <header className="flex items-center justify-between p-6 mb-6 bg-card-light dark:bg-card-dark rounded-lg shadow-sm sm:p-8">
        <div className="flex items-center justify-between w-full sm:justify-start gap-5">
          <span className="text-sm text-text-02 dark:text-slate-300">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        
        <div className="hidden sm:flex gap-2">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-4 bg-bg-light dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-white dark:hover:text-text-02 text-text-02 font-bold text-sm rounded-full transition-all"
          >
            Edit
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-4 bg-red-500 hover:bg-red-400 text-white font-bold text-sm rounded-full transition-all"
          >
            Delete
          </button>
          {invoice.status !== 'paid' && (
            <button 
              onClick={() => handleStatusUpdate('paid')}
              className="px-6 py-4 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-full transition-all"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </header>

      <main className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-sm sm:p-12 mb-12 sm:mb-0">
        {/* Invoice ID & Description */}
        <div className="flex flex-col sm:flex-row sm:justify-between mb-8">
          <div className="mb-8 sm:mb-0">
            <h1 className="text-xl font-bold uppercase mb-2">
              <span className="text-text-02">#</span>{invoice.id}
            </h1>
            <p className="text-sm text-text-02">{invoice.description}</p>
          </div>
          <div className="text-sm text-text-02 text-left sm:text-right">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        {/* Client & Date Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm text-text-02 mb-3">Invoice Date</h3>
              <p className="text-lg font-bold">{format(new Date(invoice.createdAt), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <h3 className="text-sm text-text-02 mb-3">Payment Due</h3>
              <p className="text-lg font-bold">{format(new Date(invoice.paymentDue), 'dd MMM yyyy')}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-text-02 mb-3">Bill To</h3>
            <p className="text-lg font-bold mb-2">{invoice.clientName}</p>
            <div className="text-sm text-text-02">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm text-text-02 mb-3">Sent to</h3>
            <p className="text-lg font-bold truncate">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="bg-bg-light dark:bg-[#252945] rounded-t-lg p-6 sm:p-8">
          {/* Desktop Headers */}
          <div className="hidden sm:grid grid-cols-4 gap-4 mb-8 text-sm text-text-02">
            <span className="col-span-2">Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>

          {/* Items */}
          <div className="space-y-6">
            {invoice.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center sm:grid sm:grid-cols-5 gap-4">
                <div className="flex flex-col sm:col-span-2">
                  <span className="font-bold text-sm mb-2 sm:mb-0">{item.name}</span>
                  <span className="sm:hidden text-sm font-bold text-text-02">
                    {item.quantity} x {formatCurrency(item.price)}
                  </span>
                </div>
                <span className="hidden sm:block text-center font-bold text-sm text-text-02">
                  {item.quantity}
                </span>
                <span className="hidden sm:block text-right font-bold text-sm text-text-02">
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
        <div className="bg-[#373B53] dark:bg-black rounded-b-lg p-6 sm:px-8 flex items-center justify-between text-white">
          <span className="text-xs font-medium">Amount Due</span>
          <span className="text-2xl font-bold">{formatCurrency(invoice.total)}</span>
        </div>
      </main>

      {/* Mobile Footer Actions */}
      <footer className="fixed bottom-0 left-0 w-full p-6 bg-white dark:bg-card-dark flex items-center justify-center gap-2 sm:hidden shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-4 bg-bg-light dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-white dark:hover:text-text-02 text-text-02 font-bold text-sm rounded-full transition-all"
        >
          Edit
        </button>
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-6 py-4 bg-red-500 hover:bg-red-400 text-white font-bold text-sm rounded-full transition-all"
        >
          Delete
        </button>
        {invoice.status !== 'paid' && (
          <button 
            onClick={() => handleStatusUpdate('paid')}
            className="px-6 py-4 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-full transition-all"
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
