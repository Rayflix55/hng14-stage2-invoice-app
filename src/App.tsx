/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import Sidebar from './components/Sidebar';
import InvoiceListPage from './pages/InvoiceListPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col lg:flex-row">
          <Sidebar />
          <main className="flex-1 pt-24 pb-12 px-6 mx-auto w-full max-w-3xl lg:pt-12 lg:px-12 lg:max-w-4xl xl:max-w-5xl transition-all duration-300">
            <Routes>
              <Route path="/" element={<InvoiceListPage />} />
              <Route path="/invoice/:id" element={<InvoiceDetailPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

