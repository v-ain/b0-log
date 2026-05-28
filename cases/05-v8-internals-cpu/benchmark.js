const { performance } = require('node:perf_hooks');

// Количество элементов (10 миллионов для хорошего прогрева CPU)
const ITERATIONS = 10_000_000;

console.log('--- 🔬 Starting V8 Memory Layout Benchmark ---');
console.log(`Array Size: ${ITERATIONS.toLocaleString()} elements\n`);

// ==========================================
// 1. Тест: Массив объектов (Pointer Chasing)
// ==========================================
const objectArray = [];
for (let i = 0; i < ITERATIONS; i++) {
    objectArray.push({ value: i });
}

// Прогрев JIT-компилятора V8 перед замером
let warmup1 = 0;
for (let i = 0; i < 1000; i++) warmup1 += objectArray[i].value;

const startObj = performance.now();
let sumObj = 0;
for (let i = 0; i < ITERATIONS; i++) {
    sumObj += objectArray[i].value;
}
const endObj = performance.now();
const objTime = endObj - startObj;

console.log(`1. Object Array (Heap): ${objTime.toFixed(2)} ms`);


// ==========================================
// 2. Тест: TypedArray (Contiguous Memory)
// ==========================================
const typedArray = new Int32Array(ITERATIONS);
for (let i = 0; i < ITERATIONS; i++) {
    typedArray[i] = i;
}

// Прогрев JIT-компилятора V8 перед замером
let warmup2 = 0;
for (let i = 0; i < 1000; i++) warmup2 += typedArray[i];

const startTyped = performance.now();
let sumTyped = 0;
for (let i = 0; i < ITERATIONS; i++) {
    sumTyped += typedArray[i];
}
const endTyped = performance.now();
const typedTime = endTyped - startTyped;

console.log(`2. TypedArray (Contiguous): ${typedTime.toFixed(2)} ms`);


// ==========================================
// 📈 Подведение итогов
// ==========================================
console.log('\n--- 📊 Final Verdict ---');
if (typedTime < objTime) {
    const ratio = (objTime / typedTime).toFixed(1);
    console.log(`🚀 TypedArray is ${ratio}x FASTER than Object Array!`);
} else {
    console.log('V8 optimized both equally (unlikely at this scale).');
}

// Защита от удаления кода оптимизатором (чтобы V8 не вырезал "неиспользуемые" переменные)
if (sumObj === sumTyped) { /* Ничего не делаем, просто сохраняем ссылки */ }

