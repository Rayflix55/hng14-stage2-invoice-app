import { useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, Plus, ChevronLeft } from 'lucide-react';
import { Invoice, InvoiceItem, PaymentStatus } from '../types';
import { cn, generateInvoiceId } from '../lib/utils';
import { addDays, format } from 'date-fns';

interface InvoiceFormProps {
  onClose: () => void;
  onSave: () => void;
  existingInvoice?: Invoice;
}

export default function InvoiceForm({ onClose, onSave, existingInvoice }: InvoiceFormProps) {
  const isEditing = !!existingInvoice;
  
  const [formData, setFormData] = useState<Partial<Invoice>>(
    existingInvoice || {
      id: generateInvoiceId(),
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      paymentDue: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      paymentTerms: 30,
      description: '',
      clientName: '',
      clientEmail: '',
      status: 'pending',
      senderAddress: { street: '', city: '', postCode: '', country: '' },
      clientAddress: { street: '', city: '', postCode: '', country: '' },
      items: [],
      total: 0,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName) newErrors.clientName = "can't be empty";
    if (!formData.clientEmail) {
      newErrors.clientEmail = "can't be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = "invalid format";
    }
    if (!formData.description) newErrors.description = "can't be empty";
    if (!formData.senderAddress?.street) newErrors.senderStreet = "can't be empty";
    if (!formData.items || formData.items.length === 0) newErrors.items = "- An item must be added";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: PaymentStatus) => {
    if (status !== 'draft' && !validate()) return;

    const dataToSave = {
      ...formData,
      status,
      total: formData.items?.reduce((sum, item) => sum + item.total, 0) || 0,
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/invoices/${formData.id}` : '/api/invoices';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave),
    });

    if (res.ok) {
      onSave();
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
    };
    setFormData((prev: Partial<Invoice>) => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const removeItem = (id: string) => {
    setFormData((prev: Partial<Invoice>) => ({
      ...prev,
      items: prev.items?.filter((item: InvoiceItem) => item.id !== id)
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setFormData((prev: Partial<Invoice>) => {
      const newItems = (prev.items || []).map((item: InvoiceItem) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'price') {
            updated.total = updated.quantity * updated.price;
          }
          return updated;
        }
        return item;
      });
      return { ...prev, items: newItems };
    });
  };

  const inputClasses = (hasError?: boolean) => cn(
    "w-full h-12 px-5 bg-white dark:bg-card-dark border rounded-md font-bold text-sm outline-none transition-all placeholder:opacity-40",
    "border-input-border-light dark:border-input-border-dark",
    "focus:border-primary focus:ring-0",
    hasError && "border-accent-red focus:border-accent-red"
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute top-0 left-0 w-full h-full max-w-2xl bg-card-light dark:bg-card-dark overflow-y-auto lg:top-0 lg:left-[103px] lg:h-full lg:max-w-[719px]"
      >
        <div className="p-8 pb-32 md:p-14">
          <button onClick={onClose} className="flex items-center gap-6 font-bold text-sm mb-8 hover:text-text-02 md:hidden">
            <ChevronLeft size={16} className="text-primary" />
            Go Back
          </button>
          
          <h2 className="text-3xl font-bold mb-12">
            {isEditing ? (
              <>Edit <span className="text-text-02">#</span>{formData.id}</>
            ) : 'New Invoice'}
          </h2>

          <div className="space-y-10">
            {/* Bill From */}
            <section>
              <h3 className="text-primary font-bold text-sm mb-6 uppercase tracking-wider">Bill From</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm text-text-02 mb-2 flex justify-between">
                    Street Address {errors.senderStreet && <span className="text-accent-red text-xs">{errors.senderStreet}</span>}
                  </label>
                  <input 
                    type="text" 
                    value={formData.senderAddress?.street}
                    onChange={e => setFormData({...formData, senderAddress: {...formData.senderAddress!, street: e.target.value}})}
                    className={inputClasses(!!errors.senderStreet)} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-02 mb-2">City</label>
                  <input 
                    type="text" 
                    value={formData.senderAddress?.city}
                    onChange={e => setFormData({...formData, senderAddress: {...formData.senderAddress!, city: e.target.value}})}
                    className={inputClasses()} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-02 mb-2">Post Code</label>
                  <input 
                    type="text" 
                    value={formData.senderAddress?.postCode}
                    onChange={e => setFormData({...formData, senderAddress: {...formData.senderAddress!, postCode: e.target.value}})}
                    className={inputClasses()} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-02 mb-2">Country</label>
                  <input 
                    type="text" 
                    value={formData.senderAddress?.country}
                    onChange={e => setFormData({...formData, senderAddress: {...formData.senderAddress!, country: e.target.value}})}
                    className={inputClasses()} 
                  />
                </div>
              </div>
            </section>

            {/* Bill To */}
            <section>
              <h3 className="text-primary font-bold text-sm mb-6 uppercase tracking-wider">Bill To</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm text-text-02 mb-2 flex justify-between">
                    Client's Name {errors.clientName && <span className="text-accent-red text-xs">{errors.clientName}</span>}
                  </label>
                  <input 
                    type="text" 
                    value={formData.clientName}
                    onChange={e => setFormData({...formData, clientName: e.target.value})}
                    className={inputClasses(!!errors.clientName)}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm text-text-02 mb-2 flex justify-between">
                    Client's Email {errors.clientEmail && <span className="text-accent-red text-xs">{errors.clientEmail}</span>}
                  </label>
                  <input 
                    type="email" 
                    placeholder="e.g. email@example.com"
                    value={formData.clientEmail}
                    onChange={e => setFormData({...formData, clientEmail: e.target.value})}
                    className={inputClasses(!!errors.clientEmail)}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm text-text-02 mb-2">Street Address</label>
                  <input 
                    type="text" 
                    value={formData.clientAddress?.street}
                    onChange={e => setFormData({...formData, clientAddress: {...formData.clientAddress!, street: e.target.value}})}
                    className={inputClasses()} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-02 mb-2">City</label>
                  <input 
                    type="text" 
                    value={formData.clientAddress?.city}
                    onChange={e => setFormData({...formData, clientAddress: {...formData.clientAddress!, city: e.target.value}})}
                    className={inputClasses()} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-02 mb-2">Post Code</label>
                  <input 
                    type="text" 
                    value={formData.clientAddress?.postCode}
                    onChange={e => setFormData({...formData, clientAddress: {...formData.clientAddress!, postCode: e.target.value}})}
                    className={inputClasses()} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-02 mb-2">Country</label>
                  <input 
                    type="text" 
                    value={formData.clientAddress?.country}
                    onChange={e => setFormData({...formData, clientAddress: {...formData.clientAddress!, country: e.target.value}})}
                    className={inputClasses()} 
                  />
                </div>
              </div>
            </section>

            {/* Other Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text-02 mb-2">Invoice Date</label>
                <div className="relative group">
                  <input 
                    type="date" 
                    value={formData.createdAt}
                    onChange={e => setFormData({...formData, createdAt: e.target.value})}
                    className={cn(inputClasses(), "relative z-10 bg-transparent dark:bg-transparent cursor-pointer")} 
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.6667 1.33333V4M5.33333 1.33333V4M2 6.66667H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-02 mb-2">Payment Terms</label>
                <div className="relative group">
                    <select 
                      value={formData.paymentTerms}
                      onChange={e => setFormData({...formData, paymentTerms: Number(e.target.value)})}
                      className={cn(inputClasses(), "appearance-none relative z-10 bg-transparent dark:bg-transparent cursor-pointer")}
                    >
                      <option value={1} className="dark:bg-input-border-dark">Net 1 Day</option>
                      <option value={7} className="dark:bg-input-border-dark">Net 7 Days</option>
                      <option value={14} className="dark:bg-input-border-dark">Net 14 Days</option>
                      <option value={30} className="dark:bg-input-border-dark">Net 30 Days</option>
                    </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-primary group-hover:rotate-180 transition-transform">
                    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5.5 5.5L10 1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-text-02 mb-2 flex justify-between">
                  Project Description {errors.description && <span className="text-accent-red text-xs">{errors.description}</span>}
                </label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className={inputClasses(!!errors.description)}
                />
              </div>
            </section>

            {/* Item List */}
            <section>
              <h3 className="text-[#777F98] font-bold text-xl mb-4 tracking-tight">Item List</h3>
              <div className="space-y-4">
                {formData.items?.map((item) => (
                   <div key={item.id} className="grid grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="col-span-12 md:col-span-4">
                      <label className="md:hidden block text-sm text-text-02 mb-2 font-medium">Item Name</label>
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        className={inputClasses()}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <label className="md:hidden block text-sm text-text-02 mb-2 font-medium">Qty.</label>
                      <input 
                        type="number" 
                        min="1"
                        value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className={cn(inputClasses(), "px-2 text-center")}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-3">
                      <label className="md:hidden block text-sm text-text-02 mb-2 font-medium">Price</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={item.price}
                        onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
                        className={inputClasses()}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <label className="md:hidden block text-sm text-text-02 mb-2 font-medium">Total</label>
                      <div className="w-full h-12 flex items-center justify-center font-bold text-text-02 text-sm">
                        {item.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-center pb-3">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-text-02 hover:text-accent-red transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addItem}
                  className="w-full h-12 mt-4 bg-bg-light dark:bg-input-border-dark hover:bg-[#DFE3FA] dark:hover:bg-white dark:hover:text-text-02 text-text-02 font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add New Item
                </button>
                {errors.items && <p className="text-accent-red text-sm font-bold mt-2">{errors.items}</p>}
              </div>
            </section>
          </div>
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 left-0 w-full p-8 md:px-14 bg-card-light dark:bg-card-dark flex justify-between items-center shadow-[0_-20px_40px_rgba(0,0,0,0.1)] rounded-tr-[20px]">
          <div>
            <button 
              onClick={onClose}
              className="px-6 py-4 bg-bg-light dark:bg-input-border-dark hover:bg-[#DFE3FA] dark:hover:bg-white dark:hover:text-text-02 text-text-02 font-bold text-sm rounded-full transition-all"
            >
              {isEditing ? 'Cancel' : 'Discard'}
            </button>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <button 
                onClick={() => handleSave('draft')}
                className="px-6 py-4 bg-[#373B53] hover:bg-black text-text-03 font-bold text-sm rounded-full transition-all"
              >
                Save as Draft
              </button>
            )}
            <button 
              onClick={() => handleSave('pending')}
              className="px-6 py-4 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-full transition-all"
            >
              {isEditing ? 'Save Changes' : 'Save & Send'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
