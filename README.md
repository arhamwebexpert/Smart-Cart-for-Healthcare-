# Smart Cart for Healthcare - Frontend

This is the frontend application for the Smart Cart for Healthcare project. Built with React and Vite, it provides a modern, responsive user interface for managing and monitoring smart healthcare carts.

## 🚀 Features

- Real-time cart monitoring and management
- Interactive dashboard with data visualization
- Responsive design using Tailwind CSS
- Modern React with hooks and functional components
- State management with Zustand
- Client-side routing with React Router

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (Node Package Manager)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Smart-Cart-for-Healthcare-
```

2. Install dependencies:
```bash
npm install
```

## 🔧 Configuration

The application uses the following default configurations:
- Development server port: 5000 (as configured in vite.config.js)
- Backend API endpoint: Configured in your environment variables

## 🚀 Running the Application

For development:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## 📦 Dependencies

### Core Dependencies
- react: ^19.0.0 - UI library
- react-dom: ^19.0.0 - React DOM rendering
- react-router-dom: ^7.5.2 - Client-side routing
- axios: ^1.9.0 - HTTP client
- zustand: ^5.0.3 - State management
- react-use-websocket: ^4.13.0 - WebSocket integration
- recharts: ^2.15.3 - Data visualization
- prop-types: ^15.8.1 - Runtime type checking

### Development Dependencies
- vite: ^6.3.3 - Build tool and dev server
- tailwindcss: ^3.4.17 - Utility-first CSS framework
- eslint: ^9.22.0 - Code linting
- postcss: ^8.5.3 - CSS processing
- autoprefixer: ^10.4.21 - CSS vendor prefixing

## 📁 Project Structure

```
Smart-Cart-for-Healthcare-/
├── src/               # Source files
├── public/           # Static assets
├── index.html        # Entry HTML file
├── vite.config.js    # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js # PostCSS configuration
└── package.json      # Project dependencies and scripts
```

## 🎨 UI/UX Features

- Modern and clean interface
- Responsive design for all screen sizes
- Real-time data updates
- Interactive charts and graphs
- Intuitive navigation
- Loading states and error handling

## 🔐 Security

- Environment variable management
- Secure API communication
- WebSocket connection security
- Input validation and sanitization

## 🧪 Testing

To run the linter:
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
