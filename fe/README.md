# Car Dealership Frontend

This is the frontend application for the Car Dealership project, built with React, TypeScript, Ant Design, and Tailwind CSS.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd car-dealership-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```
REACT_APP_API_URL=http://localhost:9200/api
```

4. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:9200`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── admin/       # Admin-specific components
│   └── common/      # Shared components
├── contexts/        # React contexts
├── pages/          # Page components
│   ├── admin/      # Admin pages
│   └── public/     # Public pages
├── services/       # API services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main App component
└── index.tsx       # Application entry point
```

## Features

- User authentication and authorization
- Admin dashboard
- Product management
- Order management
- User management
- Category management
- Responsive design
- Dark mode support

## Technologies Used

- React
- TypeScript
- Ant Design
- Tailwind CSS
- React Router
- Axios
- Web Vitals

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
