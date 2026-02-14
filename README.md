Project Link: https://kaizen-log.vercel.app/

# Kaizen - Trading Tracker

A specialized, monochrome web application designed exclusively for tracking trading income, expenses, and performance metrics. Built for focus and clarity.

## Features

*   **Trading Dashboard:** Immediate insight into your Net Balance, Monthly Income, Expenses, and Monthly Savings.
*   **Specialized Tracking:** Dedicated forms for separate Income and Expense tracking, defaulting to "Trading" category for streamlined entry.
*   **Monochrome Theme:** A distraction-free, high-contrast black and white (grayscale) design available in both Light and Dark modes.
*   **Focused Analytics:** Visualization of functionality including Net Balance Trend and Profit & Loss Over Time.
*   **Transaction History:** Searchable and filterable list of all trading activities.
*   **Journal:** Integrated journal to record trading notes, psychology, and daily logs.
*   **Premium UX:** Smooth loading states with custom "Kaizen" logo animations and Skeleton UI to prevent layout shifts.
*   **Secure Authentication:** User login and registration to keep your financial data private.

## Technologies Used

*   **React:** Frontend library for building the user interface.
*   **Vite:** Fast, modern build tool.
*   **Tailwind CSS:** Utility-first CSS framework for custom, responsive design.
*   **Firebase Authentication:** Secure email/password and Google Sign-In.
*   **Recharts:** Composable charting library for React.
*   **Framer Motion:** For smooth animations and transitions.
*   **Lucide React:** Beautiful, consistent icons.

## Setup and Installation

### Prerequisites

*   npm (Node Package Manager)
    ```bash
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo
    ```bash
    git clone https://github.com/Priyanshu-x/income-tracker-frontend
    ```
2.  Navigate into the project directory
    ```bash
    cd income-tracker
    ```
3.  Install NPM packages
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root directory:
    ```
    VITE_API_URL=http://localhost:5000
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
5.  Run the development server
    ```bash
    npm run dev
    ```

### Deployment
This project is configured for **Vercel**.
- The `vercel.json` file handles Single Page Application (SPA) routing, preventing 404 errors on refresh.
- Ensure you add the environment variables in your Vercel project settings.

## Usage

After installation, open your browser and navigate to the local server address (usually `http://localhost:5173`).
Log in to access your dashboard and start tracking your trading journey.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please fork the repo and create a pull request.
