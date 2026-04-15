# CyberNews Aggregator: A Journey in Web Performance Engineering

Welcome to the **CyberNews Aggregator**! 

This repository isn't just a simple HackerNews clone but a dedicated, hands-on masterclass in **Web Performance Engineering**. Built with React and Vite, the core objective of this project is to showcase how underlying architectural decisions directly impact user experience and Google's **Core Web Vitals (CWV)**—specifically Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).

---

## Project Structure: The Tale of Two Branches

To truly understand how to make an application fast, you must first understand what makes it intrinsically slow. Because of this, the project exists across two distinct Git branches:

### 1. The `slow-version` Branch (The Anti-Pattern Baseline)
If you switch to this branch, you will encounter the **"Before"** state. It was deliberately engineered with common industry anti-patterns:
- **The Network Waterfall:** It sequentially fetches all 500 HackerNews articles one by one inside a tightly-coupled `for` loop, grinding data delivery to a halt.
- **Unbounded Assets:** It features a massive, uncompressed Hero image (`>2MB`) lacking `width`, `height`, or `loading` tags, destroying layout stability (CLS).
- **The Monolith:** It forces the browser to pull down the *entire* Lodash library instead of cherry-picking utilities.
- **DOM Overload:** It attempts to render 500 rich DOM article elements at once, freezing the main thread entirely and destroying Interaction to Next Paint (INP) whenever you try to type into the search filter.

### 2. The `main` Branch (The Optimized Masterpiece)
The primary branch you are viewing right now is the **"After"** state. I applied strict performance auditing to systematically eliminate every bottleneck:
- **Concurrent Connections:** I replaced the terrifying network waterfall with `Promise.all()`, fetching 500 endpoints strictly in parallel.
- **List Virtualization (`@tanstack/react-virtual`):** Instead of punishing the browser with 500 DOM nodes, we virtualized the list. The DOM now only renders the ~10 articles physically visible on your screen, dynamically hotswapping them as you scroll. Memory stays flat, and filtering arrays is now lightning-fast!
- **Code Chunking & Tree Shaking:** Replaced generic `lodash` imports with specific `lodash/sortBy` paths. I wrapped the heavy `VirtualizedList` in `React.lazy()` boundaries so the Vite bundler chunks our Javascript into tiny, digestible pieces.
- **Deterministic Images:** The hero image enforces strict `width="1200"` constraints and native lazy loading, locking the visual frame into position before the image bytes even finish downloading. Layout shifting is completely eradicated.

---

## The Audit Data

I rigorously profiled both versions using headless Chrome Lighthouse against Dockerized environments to capture highly authentic statistics. 

Please view the **`PERFORMANCE.md`** file located in this repository's root. Inside, you will find our tabulated lab scores, deeper technical root-cause analyses, and fascinating explanations as to why lab tools sometimes misinterpret performance gaps when dealing with enormous headless HTTP queues.

---

## How to Run the Project (Dockerized)

For a highly consistent standard, lets employ Docker to guarantee that the application matches the exact environment it was built for without requiring localized OS setups.

### Prerequisites:
- Local installation of **Docker Desktop**.

### Execution Steps
To experience the optimized branch running flawlessly:

1. Copy `.env.example` to `.env` (the defaults are already perfect).
2. Start the multi-stage deployment using Compose:
   ```bash
   docker-compose up -d --build
   ```
3. Open your favorite desktop browser and navigate to:
   **`http://localhost:3000`**

When you are done testing the aggregator, spin the container down safely:
```bash
docker-compose down
```

*(I learnt how to work with the speed version, but if you want to experience the laggy, unoptimized build firsthand, simply type `git checkout slow-version` and repeat the same Docker commands!)*

---

*Built by NagaSai.*
