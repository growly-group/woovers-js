# <img width="35" src="https://github.com/woovibr/.github/assets/70824102/6c9dda94-84cd-4fba-bdfa-fa135b9454d9"> woovers-js

**Woovers** is a lightweight Node.js server built on **Express.js** designed to mimic the Woovi/OpenPIX API. Originally in-memory, it now supports **SQLite storage**, allowing persistent data storage for your testing and development needs.  

It includes functionalities such as QR code generation (for testing purposes only), webhooks, and other basic API interactions.  

> âš ï¸� **Important:**  
> Woovers-js is **not affiliated with Woovi/OpenPIX**. This project only mimics the official API and is meant for development/testing. It does **not guarantee** full compatibility with official or new features.

## Features

- Mimics Woovi/OpenPIX API endpoints  
- QR code generation for mock transactions  
- Webhook support  
- Persistent storage with SQLite  

## Installation

```bash
git clone <repository-url>
cd woovers-js
yarn install
```

## Running the Server

```bash
yarn go
```

> The server will start and use **SQLite** to store transaction data instead of in-memory storage.  

## Usage

Once the server is running, you can:  

- Send mock API requests  
- Generate QR codes  
- Receive webhooks  

Refer to the API documentation (if available) for endpoint details.  

## Contributing

Contributions are welcome! Please follow these steps:

1. **Create an Issue** â€“ Describe the bug, feature, or enhancement you want to implement.  
2. **Fork the Repository** â€“ Click the fork button on GitHub.  
3. **Make Changes** â€“ Implement your feature or fix.  
4. **Open a Pull Request** â€“ Include a clear description of your changes.  
5. **Assign a Reviewer** â€“ Assign a maintainer or project member to review your PR.  
