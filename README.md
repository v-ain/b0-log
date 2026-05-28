# 📖 b0-log

> `An engineering journal about JavaScript performance, enterprise standards, and code aesthetics.`

Welcome to my engineering journal. The name **`b0-log`** is a mathematical inside joke for Computer Science minds: it represents the engineering transition from heavy, nested complexity to hyper-efficient runtime efficiency ($O(N^2) \rightarrow O(\log N)$).

Here, I don't just accumulate boilerplate code. I dissect software under a microscope to discover how JavaScript (V8) and underlying CPU hardware behave under heavy execution paths.

---

## 📚 Journal Issues & Case Studies

### ⚡ [Issue #1: Bitwise State Machine vs CPU Branch Prediction](./cases/01-bitmasks-branch-prediction/)
*   **Topic:** Low-level string optimization and zero-allocation pipelines (LeetCode 3120/3121).
*   **Result:** `0ms` & `55ms` (**Beats 100.00%** of JS Submissions) 🏆
*   **Key Insights:** Shifting to ASCII memory arrays, eliminating hot-loop dynamic memory garbage collection, and removing branch-misprediction bottlenecks.

### ⛓️ [Issue #2: Designing an O(1) LRU Cache](./cases/02-lru-cache/)
*   **Topic:** Hybrid data structures and predictive eviction policies (LeetCode 146).
*   **Result:** Strict $O(1)$ lookup and write complexity.
*   **Key Insights:** Coupling Hash Maps with Doubly Linked Lists, implementing Sentinel boundary nodes to eliminate conditional code branches, and zero heap-search overhead.

### 📦 [Issue #3: Full-Stack Monorepo Architecture with Zod](./cases/03-monorepo-zod/)
*   **Topic:** End-to-end type synthesis and contract deterministic systems.
*   **Result:** Single source of truth across `client` and `server` domains.
*   **Key Insights:** Using schema composition (`.extend()`), automating type generation via `z.infer`, and preventing type/validation drift across ingress network boundaries.

### 🗄️ [Issue #4: Refactoring via Product Insights & Soft Delete](./cases/04-product-insights-soft-delete/)
*   **Topic:** Data lifecycle architecture and real-world system dogfooding.
*   **Result:** Shifting from tutorial checkboxes to enterprise data preservation patterns.
*   **Key Insights:** Practice-driven system design (Dogfooding), Soft Delete patterns, and evaluating back-end storage partitioning strategies (`notes.json` vs `archive.json`).

