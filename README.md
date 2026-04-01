# Finance Dashboard

A clean, responsive, beginner-friendly React finance dashboard built to visualize transactions. View your mock balance, explore incoming/outgoing cash flows via Recharts, and manage data gracefully using Zustand.

## Tech Stack
* **React 19 & Vite** - Lightning-fast UI framework and build tool.
* **Tailwind CSS v4** - Utility-first styling with minimal configuration.
* **Zustand** - Global state management for lightweight and intuitive hooks.
* **Recharts** - Declarative and responsive charts for data visualization.
* **Lucide React** - Modern SVG icons.

## Folder Structure
```
src/
├── components/          // Reusable UI pieces categorized by domain
│   ├── layout/          // App shell: Sidebar, Header (Role switcher), Bottom nav
│   ├── dashboard/       // High-level chunks: Summary cards, Recharts 
│   ├── transactions/    // Table list, Filters array, Add transaction modal, Empty states
│   └── insights/        // AI-themed extra stats widget
├── data/                // Static JSON-like mock config
├── hooks/               // Custom React logic e.g., Filter/Sort
├── pages/               // Main assembly views matching routes
├── store/               // Global Zustand configuration
└── utils/               // Pure helper JS for Formatting/Dates
```

## How to Run

1. Make sure you have Node >18.
2. In the folder `finance-dashboard`, run `npm install`.
3. Start the dev server: `npm run dev`.
4. Open the link provided (usually `http://localhost:5173/`).

## Features Note

* **Role Switching**: Use the toggle in the header switch between Admin vs. Viewer scenarios. Notice the "Add Transaction" and Row edit/delete buttons lock down.
* **Filter & Search**: Uses custom memoized hooks (`useTransactions`) hooked securely to the `useFinanceStore` global Zustand. Try sorting tabs as well!
* **Charts Reactivity**: The Recharts instances instantly rebuild metrics based on the current state. Negative amounts show realistically. 
* **Mobile Ready**: The sidebar converts to a simple 4-tab mobile tab bar when collapsing window sizes.