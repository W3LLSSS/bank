# Bank App

A React + TypeScript web application simulating basic banking operations, including balance display, transaction management, and undo/redo functionality.

---

## Features

- View real-time account balance
- List transaction history with deposits and transfers
- Add new deposits or transfers via modal dialogs
- Undo and redo transactions for flexible state management
- Strong typing with TypeScript for maintainability

---

## Technologies

- React (with TypeScript)
- React Hooks for state management
- CSS Modules / Styled Components (specify if applicable)
- Vite / Create React App (specify if applicable)

---

## Architecture

- `App.tsx`: Main app component managing state and rendering
- `Balance.tsx`: Displays the current account balance
- `TransactionsList.tsx`: Shows list of all transactions
- `TransactionModal.tsx`: Modal for adding/editing transactions
- `UndoRedo.tsx`: Undo and redo transaction actions
- `utils/transactionHelpers.ts`: Helper functions for transactions
- `types.ts`: TypeScript interfaces and types

---

## Getting Started

### Prerequisites

- Node.js (Latest version stable or older)
- npm or yarn package manager

### Installation

```bash
git clone https://github.com/W3LLSSS/bank.git
cd bank
npm install
