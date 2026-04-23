# 📊 Invoice Portal - Full-Stack Management System

A production-grade, full-stack invoice management application engineered for high-performance and seamless user experiences. Built with a focus on polished UI/UX, robust persistence, and a highly configurable design system.

---

## 🛠 Technical Stack

### **Frontend**
- **React 19 & TypeScript**: Leverages the latest React features for efficient rendering and strictly typed interfaces for developer safety.
- **Vite 6**: Utilizing the latest iteration of Vite for ultra-fast HMR (Hot Module Replacement) and optimized production builds.
- **Tailwind CSS 4**: Implementing the next generation of Tailwind, utilizing zero-runtime CSS and advanced CSS variables for a modern styling workflow.
- **Framer Motion 12**: Orchestrating complex component transitions, including the slide-over invoice forms and interactive modals.
- **React Router 7**: Managing synchronized navigation and ID-based routing for detailed invoice tracking.

### **Backend**
- **Node.js & Express**: A lightweight but scalable REST API serving as the application's data backbone.
- **Zero-Config Persistence**: Production-grade data storage using **Browser LocalStorage**, ensuring data is ultra-fast and stays with the user even on serverless deployments (Vercel).
- **tsx**: Modern TypeScript execution for the Node runtime, enabling ES Module support out of the box.

---

## 🎨 Advanced Theming & Design System

The application features a fully reactive, persistent dark/light mode system. Unlike standard implementations, this project uses a hybrid **CSS Variable + Tailwind 4** strategy for maximum performance.

### **Implementation Details**
- **Class-based Activation**: The `ThemeContext` monitors a `.dark` class injected into the `document.body`.
- **Reactive Variables**: Colors are defined as CSS variables that swap values dynamically.
- **Tailwind v4 Selectors**: Configured with a `@custom-variant dark` bridge to ensure Tailwind's `dark:` modifier correctly responds to manual toggles rather than just system preferences.

### **Design Specifications**
- **Typography**: Primary typeface is **League Spartan**, optimized for readability across all device densities.
- **Color Fidelity**: Precise hex-code adherence to strict design guidelines (e.g., `#7C5DFA` primary brand color).

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js**: Version 18.x or higher is required.
- **Package Manager**: NPM (standard) or PNPM.

### **Local Deployment**
1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   *The server will boot on `http://localhost:3000`*.

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Reference

The server exposes a clean RESTful interface for external integrations:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/invoices` | Retrieve all invoices |
| **POST** | `/api/invoices` | Create a new invoice/draft |
| **PUT** | `/api/invoices/:id` | Update status or details of a specific invoice |
| **DELETE** | `/api/invoices/:id` | Permanently remove an invoice record |

---

## 📂 Project Architecture

```text
├── src/
│   ├── components/      # Atomic UI components and layout wrappers
│   ├── lib/             # Utility functions (formatting, ID generation, cn helper)
│   ├── pages/           # High-level route views (List, Detail)
│   ├── types/           # Global TypeScript interfaces and Enums
│   ├── App.tsx          # Main routing and provider tree
│   └── main.tsx         # Framework entry point
├── server.ts            # Full-stack Express server with Firebase Admin SDK integration
├── data.json            # Seed data (used for initial deployment only)
├── vercel.json          # Serverless routing configuration for Vercel
├── tailwind.config.ts   # Advanced Tailwind configuration
└── tsconfig.json        # Strict TypeScript compiler settings
```

---

## 💡 Key Technical Features

- **Intelligent ID Generation**: Implements a unique `#XY1234` alphanumeric pattern that remains immutable once an invoice is saved.
- **Drafting Workflow**: Users can "Save as Draft," bypassing strict schema validation to allow for work-in-progress entries.
- **Synchronized State**: Real-time arithmetic calculations for Line Items (Quantity x Price) and Grand Totals during form interaction.
- **Mobile-First Responsive Layout**: A complex grid layout that transitions from a data-heavy desktop dashboard to a touch-optimized mobile feed.

---

## ⚖️ Development Philosophy

This project prioritizes **Stability**. There is no "simulated" loading or mock persistence. Every interaction in the UI translates into a real write to the **Browser LocalStorage**, mirroring a production-grade single-user application.

---

## 👨‍💻 Developer
Developed with precision for the **HNG i14 Stage 2** challenge. focus on code quality, type safety, and design fidelity.
