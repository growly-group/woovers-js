
# <img width="35" src="https://github.com/woovibr/.github/assets/70824102/6c9dda94-84cd-4fba-bdfa-fa135b9454d9"> woovers-js

> A lightweight NodeJS server for mocking the Woovi/OpenPIX API locally

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org/)

Woovers-js is an in-memory NodeJS lightweight server based on Express.js that mimics the Woovi/OpenPIX API for development and testing purposes. It provides all basic functionality including QRCode generation, webhooks, and persistent data storage without requiring active API keys.

> [!IMPORTANT]  
> This tool is **not associated with Woovi/OpenPIX**. It is an unofficial development tool that mimics the official API behavior for testing purposes only. No support is guaranteed for existing or new functionalities.

## ✨ Features

-   🎯 **Complete API Mimicking** - Replicates Woovi/OpenPIX API endpoints
-   📱 **QR Code Generation** - Generates QR codes (not valid PIX codes for testing)
-   🔗 **Webhook Support** - Full webhook functionality for testing integrations
-   💾 **Persistent Storage** - SQLite database for data persistence
-   ⚡ **Lightweight** - Fast startup and minimal resource usage
-   🔄 **Hot Reload** - Development mode with auto-reload
-   🛠️ **Zero Configuration** - Works out of the box

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

-   **[Bun](https://bun.sh/)** - Primary runtime (recommended)
-   **Node.js** ≥16 - For type definitions and compatibility
-   **SQLite** - Automatically managed by the application

### Installation

```bash
# Clone the repository
git clone https://github.com/woovibr/woovers-js.git
cd woovers-js

# Install dependencies
bun install

```

### Running the Server

#### Production Mode

```bash
bun start

```

#### Development Mode (with auto-reload)

```bash
bun run dev

```

The server will automatically:

-   Start on the default port (usually 3000)
-   Create a SQLite database file if it doesn't exist
-   Initialize all necessary tables and configurations

## 📖 Usage

Once the server is running, you can:

1.  **Access the API** at `http://localhost:3000`
2.  **View available endpoints** in your API client or browser
3.  **Test webhooks** using the built-in webhook functionality
4.  **Generate QR codes** for testing payment flows

### Example API Calls

```bash
# Health check
curl http://localhost:3000/health

# Create a charge (example)
curl -X POST http://localhost:3000/api/v1/charge \
  -H "Content-Type: application/json" \
  -d '{"value": 1000, "comment": "Test charge"}'

```

## 🗃️ Data Storage

The application uses SQLite for persistent data storage:

-   **Database file**: Automatically created in the project root
-   **Tables**: Automatically initialized on first run
-   **Data persistence**: All data survives server restarts
-   **No setup required**: Database management is handled automatically

## 🔧 Configuration

The server can be configured through environment variables:

```bash
# .env file example
PORT=3000
DB_PATH=./woovers.db
WEBHOOK_BASE_URL=http://localhost:3000

```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](https://claude.ai/chat/CONTRIBUTING.md) for detailed guidelines on:

-   Code style and standards
-   How to submit pull requests
-   Reporting issues and bugs
-   Feature requests

### Development Setup

```bash
# Fork the repository and clone your fork
git clone https://github.com/your-username/woovers-js.git
cd woovers-js

# Install dependencies
bun install

# Run in development mode
bun run dev

# Run tests (if available)
bun test

```

## 📋 Roadmap

-   [ ] Complete API endpoint coverage
-   [ ] Enhanced webhook testing tools
-   [ ] Admin dashboard for data management
-   [ ] Docker container support
-   [ ] Comprehensive test suite
-   [ ] API documentation generator

## ⚠️ Limitations

-   **Testing Only**: Generated QR codes are not valid PIX codes
-   **No Real Transactions**: All operations are simulated
-   **Development Tool**: Not suitable for production use
-   **Unofficial**: No official support from Woovi/OpenPIX

## 📄 License

This project is open-source and available under the [MIT License](https://claude.ai/chat/LICENSE).

## 🙏 Acknowledgments

-   [Woovi/OpenPIX](https://woovi.com/) for the original API design
-   [Express.js](https://expressjs.com/) for the web framework
-   [Bun](https://bun.sh/) for the fast JavaScript runtime

----------

<p align="center"> <strong>⭐ If this project helps you, please consider giving it a star!</strong> </p>