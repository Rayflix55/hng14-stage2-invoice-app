import { Link } from 'react-router-dom';
import { Invoice } from '../types';
import { formatCurrency } from '../lib/utils';
import { ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

export default function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Link 
      to={`/invoice/${invoice.id}`}
      className="group grid grid-cols-2 md:grid-cols-5 items-center p-6 mb-4 bg-white dark:bg-card-dark rounded-lg shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)] border border-transparent hover:border-primary transition-all text-left"
      id={`invoice-${invoice.id}`}
    >
      {/* Left section: ID and Client Name (on mobile) */}
      <div className="flex flex-col md:flex-row md:items-center md:col-span-1">
        <span className="font-bold uppercase text-sm mb-6 md:mb-0">
          <span className="text-text-02">#</span>
          {invoice.id}
        </span>
      </div>

      {/* Date */}
      <div className="hidden md:block md:col-span-1">
        <span className="text-sm text-text-02 dark:text-slate-300">
          Due {format(new Date(invoice.paymentDue), 'dd MMM yyyy')}
        </span>
      </div>

      {/* Client Name */}
      <div className="flex flex-col text-right md:text-left md:col-span-1">
        <span className="text-sm text-text-02 dark:text-slate-300 md:hidden mb-2">
          Due {format(new Date(invoice.paymentDue), 'dd MMM yyyy')}
        </span>
        <span className="text-sm text-text-02 dark:text-slate-300 truncate">
          {invoice.clientName}
        </span>
      </div>

      {/* Right section: Amount and Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end md:col-span-2 md:gap-10 mt-6 md:mt-0">
        <span className="font-bold text-lg leading-6 tracking-tight mb-2 md:mb-0">
          {formatCurrency(invoice.total)}
        </span>
        
        <div className="flex items-center gap-4">
          <StatusBadge status={invoice.status} />
          <ChevronRight size={16} className="hidden md:block text-primary" />
        </div>
      </div>
    </Link>
  );
}
