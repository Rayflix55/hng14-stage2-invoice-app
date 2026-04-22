import { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Invoice, PaymentStatus } from '../types';
import InvoiceCard from '../components/InvoiceCard';
import InvoiceForm from '../components/InvoiceForm';
import { AnimatePresence, motion } from 'motion/react';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-10 w-[242px] h-[200px]">
        {/* Simplified SVG approximation of the illustration in image 2 */}
        <svg width="242" height="200" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Envelopes */}
          <path d="M190 40L215 55L200 70L175 55L190 40Z" stroke="#7E88C3" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M40 50L65 35L80 50L55 65L40 50Z" stroke="#7E88C3" strokeWidth="0.5" strokeDasharray="2 2" />
          
          {/* Main Envelope Body */}
          <path d="M50 80H192V150H50V80Z" fill="white" stroke="#0C0E16" strokeWidth="2" />
          <path d="M50 80L121 120L192 80" stroke="#0C0E16" strokeWidth="2" />
          <path d="M50 150L100 110" stroke="#0C0E16" strokeWidth="2" />
          <path d="M192 150L142 110" stroke="#0C0E16" strokeWidth="2" />
          
          {/* Character (Simplified) */}
          <path d="M90 120C90 100 110 50 140 50C170 50 190 100 190 120H90Z" fill="#7C5DFA" />
          <circle cx="140" cy="50" r="15" fill="#FFE0D3" />
          <path d="M135 70V120M145 70V120" stroke="#0C0E16" strokeWidth="2" strokeLinecap="round" />
          
          {/* Megaphone */}
          <path d="M180 60L210 40L215 65L185 85L180 60Z" fill="#0C0E16" />
          <path d="M210 40L215 65" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-6">There is nothing here</h2>
      <p className="text-text-02 max-w-xs mx-auto text-sm leading-6">
        Create an invoice by clicking the <br />
        <span className="font-bold">New Invoice</span> button and get started
      </p>
    </div>
  );
}

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<PaymentStatus[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const res = await fetch('/api/invoices');
    const data = await res.json();
    setInvoices(data);
  };

  const toggleFilter = (status: PaymentStatus) => {
    setFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const filteredInvoices = invoices.filter(inv => 
    filter.length === 0 || filter.includes(inv.status)
  );

  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;

  return (
    <div className="w-full">
      <header className="flex items-center justify-between mb-16 px-1">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Invoices</h1>
          <p className="text-text-02 text-sm">
            <span className="hidden md:inline">There are </span>
            {filteredInvoices.length === 0 
              ? 'no invoices' 
              : `${filteredInvoices.length} ${filter.length === 1 ? filter[0] : 'total'} invoices`}
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          {/* Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="group flex items-center gap-3 font-bold text-sm hover:opacity-80 transition-opacity"
              id="filter-toggle"
            >
              Filter <span className="hidden md:inline">by status</span>
              <ChevronDown size={14} className={`text-primary transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 right-0 md:left-1/2 md:-translate-x-1/2 w-48 p-6 bg-white dark:bg-card-dark shadow-[0_10px_20px_rgba(72,84,159,0.25)] dark:shadow-none rounded-lg z-20 border dark:border-transparent"
                >
                  {(['draft', 'pending', 'paid'] as PaymentStatus[]).map(status => (
                    <label key={status} className="flex items-center gap-4 mb-4 last:mb-0 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={filter.includes(status)}
                        onChange={() => toggleFilter(status)}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded-sm border border-transparent transition-all flex items-center justify-center ${filter.includes(status) ? 'bg-primary' : 'bg-selago dark:bg-vulcan group-hover:border-primary'}`}>
                        {filter.includes(status) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 4.5L3.5 6.5L8.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="capitalize font-bold text-sm">{status}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-4 bg-primary hover:bg-primary-light text-white p-2 pr-4 rounded-full font-bold transition-all group shadow-sm active:scale-95"
            id="new-invoice-btn"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-95">
              <Plus size={14} className="text-primary" strokeWidth={4} />
            </div>
            <span>New <span className="hidden md:inline">Invoice</span></span>
          </button>
        </div>
      </header>

      <section>
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice: Invoice) => (
            <div key={invoice.id}>
              <InvoiceCard invoice={invoice} />
            </div>
          ))
        ) : (
          <EmptyState />
        )}
      </section>

      <AnimatePresence>
        {isFormOpen && (
          <InvoiceForm 
            onClose={() => setIsFormOpen(false)} 
            onSave={() => {
              setIsFormOpen(false);
              fetchInvoices();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

