## 🔬 Issue #1: Optimizing LeetCode 3121 (Medium) to 100% Runtime (55ms)

### 📌 The Challenge
The goal was to find all "special" characters where lowercase letters appear strictly before uppercase letters. Standard solutions typically use heavy abstractions like `Set`, `Map`, or repetitive string allocations via `.toLowerCase()`.

Here is the journey of how I optimized this problem from a brute-force approach to the absolute platform maximum.

### 🛠️ The Evolution of Code

#### 1. The Standard Approach (Mental Model)
Initially, the instinctive way was to use dynamic Hash Maps or objects to track character status. While it works, it triggers heavy memory allocation in the V8 heap and strains the Garbage Collector.

#### 2. Dropping String Methods & Dynamic Memory
To speed things up, I replaced `Map` with a fixed-size array of 26 elements (`O(1)` space) and dropped `.toLowerCase()`. Instead, the code reads ASCII character codes directly via `charCodeAt(i)`. Operating on pure integers allows the V8 engine to execute the loop at hardware speeds.

#### 3. The "Eureka" Moment (Data-Driven Logic)
Initially, I added a defensive check inside the loop to skip already broken characters: `if (oldMask === 4) continue;`

However, analyzing the nature of the test data revealed a bottleneck:
* **Redundant Conditionals:** Broken characters rarely repeat hundreds of times in the same string. The `if` statement evaluated to `false` almost 99% of the time, doing zero useful work.
* **CPU Branch Prediction Penalty:** Instead of optimizing, this check forced the CPU's branch predictor to constantly guess the outcome of a highly irregular condition, wasting clock cycles.

By completely removing this line, I flattened the loop into a predictable, linear bitwise operation. 

### 💻 The Winning Code

```javascript
/**
 * @param {string} word
 * @return {number}
 */
var numberOfSpecialChars = function(word) {
    const masks = new Array(26).fill(0);
    const len = word.length;
    let result = 0;
    
    // Pre-allocated variables to eliminate garbage collection overhead
    let code = 0;
    let index = 0;
    let isLower = false;
    let oldMask = 0;

    for (let i = 0; i < len; ++i) {
        code = word.charCodeAt(i);

        if (code >= 97 && code <= 122) { // 'a'-'z'
            index = code - 97;
            isLower = true;
        } else { // 'A'-'Z'
            index = code - 65;
            isLower = false;
        }

        oldMask = masks[index];

        // Flat, predictable conditional assignment
        if (isLower) {
            masks[index] = (oldMask & 2) ? 4 : (oldMask | 1);
        } else {
            masks[index] = !(oldMask & 1) ? 4 : (oldMask | 2);
        }
    }

    // O(1) Final Harvest
    for (let i = 0; i < 26; ++i) {
        if (masks[i] === 3) ++result;
    }

    return result;
};
```

### 📊 Final Performance
* **Runtime:** `55 ms` — **Beats 100.00%** of JavaScript submissions 🏆
* **Memory:** **Beats 91.30%** 🚀

