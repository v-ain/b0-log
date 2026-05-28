# 🔬 Issue #3: Monorepo Architecture — Single Source of Truth with Zod & TypeScript

### 📌 The Architectural Challenge
In typical full-stack applications, data contracts (types and validation logic) are often duplicated between the `client` and the `server`. If a database schema changes, developers must manually update frontend interfaces, validation schemas, and backend models. This loose coupling leads to type drift, production bugs, and massive maintenance overhead.

To eliminate this friction in my Notes Application, I implemented a strict **Monorepo Architecture** with a centralized domain layer (`shared/`) acting as the **Single Source of Truth**.

---

### 🗺️ The System Topology
The codebase is structured as an elegant, decoupled monorepo:

```text
├── client/          # Frontend Application (Zustand State Management)
├── server/          # Backend Service (Controller-driven JSON-file DB)
└── shared/          # Centralized Domain Layer (Shared Contracts & Schemas)
```

By isolating core business logic into `shared/`, both the frontend and backend consume identical validation pipelines and data types.

---

### 💡 Design Patterns & Structural Evolution

#### 1. Moving from Loose Interfaces to Deterministic Schemas
Initially, the project relied on native TypeScript interfaces to describe the core domain entity (`NoteEntity`). While readable, interfaces only provide build-time safety and vanish at runtime. 

To bridge this gap, I designed a pipeline where **runtime validation drives compile-time types** using **Zod**.

#### 2. Schema Extension Pattern (`.extend()`)
Instead of rewriting validation constraints for different network payloads, the architecture leverages Zod's composition features. We split input contracts from persistence models cleanly without code duplication:

*   **`NoteInputSchema`**: Handles client-side input sanitization and backend controller validation (ensuring boundaries like `NOTE_MAX_LENGTH = 3500`).
*   **`NoteEntitySchema`**: Extends the input schema on the backend by injecting infrastructure-specific metadata (`id`, `createdAt`, `updatedAt`).

#### 3. Automatic Type Synthesis (`z.infer`)
By extracting TypeScript types directly from runtime schemas via `z.infer`, the application achieves **100% end-to-end type safety**. Changing a validation constraint in `shared/` automatically updates the Zustand store on the client and the file controllers on the server.

---

### 💻 The Centralized Schema Contract (`shared/schemas.ts`)

```typescript
import { z } from 'zod';

export const NOTE_MAX_LENGTH = 3500;

/**
 * 1. Network / Ingress Payload Schema
 * Validates raw data coming from user inputs or API requests.
 */
export const NoteInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'NOTE_EMPTY' })
    .max(NOTE_MAX_LENGTH, { message: 'NOTE_TOO_LONG' }),
  body: z.string().nullable().default(null),
});

/**
 * 2. Storage / Domain Entity Schema
 * Leverages the Extension Pattern to inject database metadata.
 */
export const NoteEntitySchema = NoteInputSchema.extend({
  id: z.string().uuid(),
  isCompleted: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// 3. Automated Type Synthesis — Single Source of Truth
// Zero manual interface maintenance required.
export type NoteInput = z.infer<typeof NoteInputSchema>;
export type NoteEntity = z.infer<typeof NoteEntitySchema>;
```

---

### 📊 Strategic Architectural Benefits
*   **Zero Contract Drift:** Frontend and Backend types can never fall out of sync.
*   **Database Agnostic:** This schema structure forms a perfect data boundary, meaning the project can seamlessly migrate from flat JSON files to a robust SQL/NoSQL database without touching the frontend layer.
*   **Fail-Fast Ingress:** Malformed data is intercepted instantly at the network boundary (both on the client before shipping the fetch request, and on the server inside the controllers).


