# Invoice Portal - Full-Stack Invoice Management

A professional, feature-rich invoice management application built for the Frontend Wizards Stage 2 task. This application provides a seamless experience for creating, viewing, editing, and managing invoices with a focus on polished UI/UX and full-stack reliability.

## 🚀 Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start the Application**:
   ```bash
   npm run dev
   ```
   *Note: This starts both the Express backend and the Vite frontend in parallel.*

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript.
  - **Routing**: `react-router-dom` handles page transitions between the List and Detail views.
  - **State Management**:
    - `ThemeContext`: Manages global light/dark mode and persists state to `LocalStorage`.
    - Component State: Handles local form data and filter logic.
  - **Animations**: `framer-motion` (Motion 12) is used for the complex slide-over invoice form and staggered list entry animations.
  - **Styling**: Tailwind CSS 4 with a custom configuration to match the Figma design system.
- **Backend**: Express.js server.
  - **Vite Middleware**: Used in development to provide Hot Module Replacement.
  - **API**: A RESTful API handling CRUD operations for invoices.

## 💾 Persistence Strategy

I implemented a **Node/Express Backend** persistence strategy:
- **Server-Side Storage**: Invoices are stored in a `data.json` file on the server.
- **Persistence**: Any changes made via the UI (Create, Update, Delete, Mark as Paid) are synced to the server instantly.
- **Why?**: While LocalStorage is easier, a backend approach fulfills the "Full-Stack" requirement and ensures data can be accessed across different sessions if the server is hosted centrally.

## ♿ Accessibility Notes

- **Keyboard Navigation**: The app is fully navigable via keyboard. The `ConfirmDeleteModal` traps focus when open and can be closed with the `ESC` key.
- **Semantic HTML**: Used appropriate tags like `<main>`, `<nav>`, `<section>`, and `<button>` for screen reader compatibility.
- **Color Contrast**: Both Light and Dark modes were designed to meet WCAG AA contrast standards.
- **Labels**: Every form input is associated with a clear label, and error states are visually and programmatically announced.

## ⚖️ Trade-offs

- **Form Management**: I opted for a custom state-based form management system instead of a library like React Hook Form to maintain maximum control over the complex "Item List" logic within a short timeframe.
- **Data Persistence**: A simple JSON file was used instead of a database like MongoDB or PostgreSQL to ensure the app "just works" out of the box without external database setup.

## ✨ Bonus Improvements

- **Intelligent ID Generation**: Implemented the precise `#XY1234` ID pattern which persists across edits.
- **Dynamic Totals**: Real-time calculation of item totals and invoice grand totals during form entry.
- **Smooth Theming**: The theme transition is handled via a `transition-colors` class to avoid jarring shifts when toggling.
- **Empty State**: A helpful landing state when no invoices match the current filters.
# hng14-stage2-invoice-app
