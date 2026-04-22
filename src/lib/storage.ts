import { Invoice } from '../types';
import seedData from '../data.json';

const STORAGE_KEY = 'invoice_app_data';

export const getInvoices = (): Invoice[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Seed initial data if none exists
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData as Invoice[];
  }
  return JSON.parse(data);
};

export const saveInvoice = (invoice: Invoice): Invoice => {
  const invoices = getInvoices();
  const index = invoices.findIndex((inv) => inv.id === invoice.id);
  
  if (index !== -1) {
    invoices[index] = invoice;
  } else {
    invoices.push(invoice);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  return invoice;
};

export const deleteInvoice = (id: string): void => {
  const invoices = getInvoices();
  const filtered = invoices.filter((inv) => inv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getInvoiceById = (id: string): Invoice | undefined => {
  const invoices = getInvoices();
  return invoices.find((inv) => inv.id === id);
};
