# 🔬 Issue #2: Designing an O(1) LRU Cache (Least Recently Used)### 📌 The Challenge (LeetCode 146 — Medium)Design a data structure for a Least Recently Used (LRU) cache that supports `get` and `put` operations. The non-negotiable architectural constraint: **both operations must run in strict $O(1)$ time complexity.**
### 💡 The Architectural Concept: A Hybrid SystemAn ordinary JavaScript `Object` or `Map` provides $O(1)$ lookups, but it has no inherent sense of order to track which element is the "oldest". A standard array maintains order, but shifting elements to keep them "fresh" takes $O(N)$ time.

To solve this, I designed a **Hybrid Architecture** combining two structures:
1. **Hash Map (`new Map()`)**: Handles $O(1)$ key lookups, storing direct pointers to memory nodes.2. **Doubly Linked List (DLL)**: Handles $O(1)$ ordering. Fresh nodes are moved to the head; expired nodes are evicted from the tail.
### 🛠️ Key Optimization Techniques Used
#### 1. Sentinel/Dummy Nodes (`head` & `tail`)
Instead of managing complex edge cases and writing defensive code like `if (this.head === null)`, I initialized the list with two permanent dummy nodes connected to each other. Every real data node is inserted *between* them. This eliminates conditional branching and makes the list structurally unbreakable.
#### 2. Clean Separation of ConcernsThe business logic methods (`get` and `put`) are completely decoupled from low-level memory operations. They interact with the list using descriptive private methods (`#remove`, `#addAtHead`, `#moveToHead`).
#### 3. Zero Heap Search OverheadWhen the cache reaches its capacity, evicting the oldest element takes $O(1)$ because the tail pointer always points directly to the least recently used node. The node stores its own `key` so it can cleanly unregister itself from the Hash Map without any lookup cycles.
### 💻 Production-Ready Code
```javascript
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    /**
     * @param {number} capacity
     */
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        // Sentinel boundaries to prevent null pointer exceptions
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    /** 
     * @param {number} key
     * @return {number}
     */
    get(key) {
        if (!this.map.has(key)) return -1;

        const node = this.map.get(key);
        this.#moveToHead(node); 

        return node.value;
    }

    /** 
     * @param {number} key 
     * @param {number} value
     * @return {void}
     */
    put(key, value) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            node.value = value;
            this.#moveToHead(node);
        } else {
            if (this.map.size === this.capacity) {
                const oldestNode = this.tail.prev;
                this.#remove(oldestNode);
                this.map.delete(oldestNode.key); 
            }

            const newNode = new Node(key, value);
            this.map.set(key, newNode);
            this.#addAtHead(newNode);
        }
    }

    // --- Private DLL Memory Managers ---

    #remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    #addAtHead(node) {
        const nextNode = this.head.next;
        node.prev = this.head;
        node.next = nextNode;
        this.head.next = node;
        nextNode.prev = node;
    }

    #moveToHead(node) {
        this.#remove(node);
        this.#addAtHead(node);
    }
}
```
### 📊 Computational Complexity* **Time Complexity:** $O(1)$ for both `get()` and `put()` — Instant execution regardless of data size.* **Space Complexity:** $O(C)$ where $C$ is the maximum capacity — Strict, predictable memory ceiling suitable for enterprise environments.

