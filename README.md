# ECO Platform

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1. Install Frontend Dependencies

```bash
npm install
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

**Or use the convenience script:**

```bash
npm run start-all
```

This will install dependencies for both frontend and backend, then start both servers.

## Running the Project

### Option 1: Run Both Servers Together (Recommended)

From the root directory:

```bash
npm start
```

This will:
- Start the backend server on `http://localhost:1357` (with mock data)
- Start the frontend development server on `http://localhost:2468`

**Note**: The backend uses in-memory mock data. All data will reset when you restart the server.

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Access the Application

Once both servers are running:
- **Frontend**: Open [http://localhost:2468](http://localhost:2468) in your browser
- **Backend API**: Available at [http://localhost:1357/api](http://localhost:1357/api)
- **Health Check**: [http://localhost:1357](http://localhost:1357)
