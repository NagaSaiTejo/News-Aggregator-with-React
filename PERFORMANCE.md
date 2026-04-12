# Performance Audit Report

This document records the performance tuning phases for the High-Performance News Aggregator.

## Baseline Performance Report Table

We used Chrome Lighthouse and DevTools Performance Panel to audit the application in its initial, unoptimized state (available on the `slow-version` branch).

| Metric / Issue | Baseline Score / Observation | Root Cause Analysis | Proposed Solution Hypothesis |
| :--- | :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | ~8.1s | Large, unoptimized hero image (>2MB) without dimensions blocking the main thread. It loads eagerly and is a huge PNG. | Compress image, serve in WebP format, use `srcset`, and set explicit `width`/`height` and `loading="lazy"`. |
| **INP** (proxy: TBT - Total Blocking Time) | TBT: ~1450ms | Filtering the input causes a lag because it forcefully re-renders all 500 un-virtualized DOM nodes on every keystroke. | Implement list virtualization (e.g. `@tanstack/react-virtual`) to render only visible elements and decouple rendering cost from data size. |
| **CLS** (Cumulative Layout Shift) | ~0.55 | The hero image doesn't define standard sizes (`width` and `height`). When it finally loads, it pushes the entire UI down. | Add explicit `width` and `height` attributes to the `<img>` tag and consider a skeleton loader if necessary. |
| **Bundle Size** (`main.js`) | ~1.6MB | Full `lodash` library imported via `import _ from 'lodash'`; No code splitting implemented. | Use cherry-picked imports (e.g. `import sortBy from 'lodash/sortBy'`). Implement `React.lazy` and `Suspense` to chunk the bundle. |
| **Network Waterfall** | 501 serial requests | Sequential fetch calls utilizing a `for` loop combined with `await`. Each request delays the next. | Parallelize data fetching using `Promise.all` inside the data loading effect. |

---

## Optimization Steps & Final Results

(To be populated after implementing the optimizations on the `main` branch).
