# <img width="35" src="https://github.com/woovibr/.github/assets/70824102/6c9dda94-84cd-4fba-bdfa-fa135b9454d9"> woovers-js

# Welcome to Woovers

**Woovers** is a lightweight API simulator built with **Bun** and **Express**.  
It mimics the core behavior of the **Woovi/OpenPIX API**, but without requiring official access keys or credentials.

The goal of this project is to provide a simple way to experiment with Pix-like flows in a single environment — including:

- **Basic API endpoints and functionalities**
- **QRCode generation** (_not real/valid Pix codes xD_)
- **Webhook simulation**
- And more features under development

> [!IMPORTANT]  
> Woovers is **not affiliated with Woovi or OpenPIX**.  
> It’s an unofficial, community-driven project with no guarantees of compatibility or support.  
> The implementation only mimics the official API superficially, without reproducing all the nuances or updated features.

---

## 🛠️ Tech Stack

Woovers is powered by:

- **ExpressJS** – Minimal and fast HTTP server
- **TypeScript** – Type safety and developer experience
- **SQLite** – Lightweight persistence out of the box
- **Bun** – Modern runtime with blazing fast performance and package management

---

## ⚙️ Requirements

Make sure you have installed:

- **Bun** ≥ `1.2`

---

## 🚀 Getting Started

1. Copy the environment configuration:

   ```bash
   cp .env.example .env
   ```

2. Install project dependencies:

   ```bash
   bun install
   ```

   > **Note:** While this project uses Bun as the runtime, you can also use other package managers like `npm install`/`yarn install`/`pnpm install` to manage dependencies if preferred.

3. Start the application:
   ```bash
   bun start
   ```

By default, the server runs at:  
[http://localhost:3000](http://localhost:3000)

You can update the port in your `.env` file.

---

## Contributing

1. **Check or create an issue**

   - Look at the open [Issues](https://github.com/growly-group/woovers-js/issues) to see if someone is already working on what you want.
   - If not, open a new issue to discuss your idea before starting.

2. **Fork the repository**

   - Create your own copy of the project by forking this repo.

3. **Create a feature branch**

   ```bash
   git checkout -b feat/my-feature
   ```

4. **Commit your changes**

   ```bash
   git commit -m "feat: added my feature"
   ```

5. **Push to your fork and open a PR**
   - Push your branch:
     ```bash
     git push origin feat/my-feature
     ```
   - Open a Pull Request to the `main` branch.
   - Assign one reviewer (preferably Scarlet xD).
