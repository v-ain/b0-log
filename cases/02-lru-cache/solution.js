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

