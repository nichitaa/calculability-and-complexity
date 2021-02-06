const {plot} = require("nodeplotlib");
const {performance} = require('perf_hooks');
// Pasecinic Nichita
// FAF 192
// LAB 1
// Fibonacci

// Method - #1
// Using recursion
// Time Complexity: O(n) = O(n-1) + O(n-2) which is exponential.
// The worst implementation for nth Fibonacci number.
const fib1 = n => {
	// default cases
	if (n < 0) {
		console.log('Invalid n')
	} else if (n === 0 || n === 1) {
		return n
	} else { // recursion
		return fib1(n - 1) + fib1(n - 2)
	}
}

// Method - #2
// Dynamic programming
// avoiding recursion by storing each previous computed fibonacci number
// in an array
// Time complexity for the for loop: O(n) (excluding push expresion)
const fib2 = n => {
	let f = [0, 1]
	for (let i = 2; i <= n + 1; i++) {
		f.push(f[i - 1] + f[i - 2]) // store each fib number
	}
	return f[n]
}

// Method - #3
// Method 2 with space optimization
// store only previous 2 computed numbers
// Time complexity: O(n)
const fib3 = n => {
	let a = 0
	let b = 1
	// default cases
	if (n < 0) {
		console.log('Invalid n')
	} else if (n === 0) {
		return a
	} else if (n === 1) {
		return b
	} else {
		let c
		for (let i = 2; i < n + 1; i++) {
			c = a + b
			a = b
			b = c
		}
		return b
	}
}

// Method - #4
// Using recurrence formula for Fibonacci numbers
// 1. If n is even then k = n/2:
// --> F(n) = [2*F(k-1) + F(k)]*F(k)
// 2. If n is odd then k = (n + 1)/2
// --> F(n) = F(k)*F(k) + F(k-1)*F(k-1)
// Time complexity: O(log n)
// Because every recursion call divides the problem to half
// arr to store the fib values
let resFib4 = new Array(1000).fill(0)
const fib4 = n => {
	// default cases
	if (n === 0) {
		return 0
	}
	if (n === 2 || n === 1) {
		resFib4[n] = 1
		return resFib4[n]
	}
	// if fib of n is computed
	if (resFib4[n]) {
		return resFib4[n]
	}
	// get k after formula
	let k
	if (n % 2 !== 0) {
		k = (n + 1) / 2
	} else {
		k = n / 2
	}
	// apply formulas to compute next fib
	// note how we split the problem on every recursion call
	if (n % 2 !== 0) {
		resFib4[n] = (fib4(k) * fib4(k) + fib4(k - 1) * fib4(k - 1))
	} else {
		resFib4[n] = (2 * fib4(k - 1) + fib4(k)) * fib4(k)
	}
	return resFib4[n]
}


// Method - #5
// Using Binet's Formula for the nth Fibonacci number
// It involves our golden section number Phi and its reciprocal phi
// Exact formula: Fn = {[(√5 + 1)/2] ^ n} / √5
// Time complexity: O(1)
// Disadvantage: For a relative big n, the result is a very good approximation and not the exact number
const fib5 = n => {
	const phi = (1 + Math.sqrt(5)) / 2
	return Math.round(Math.pow(phi, n) / Math.sqrt(5))
}

// callback => one of the five above methods
const getPerformance = (n, callback) => {
	const start = performance.now()
	console.log(`For n = ${n}, ${callback.name} = ${callback(n)}`)
	const end = performance.now()
	return end - start // return execution time of the callback function
}

const runFib = (fibs) => {
	const performance1 = []
	const performance2 = []
	const performance3 = []
	const performance4 = []
	const performance5 = []
	for (let i = 0; i < fibs.length; i++) {
		console.log(`${fibs[i]} nth Fibonacci number`)
		performance1.push(getPerformance(fibs[i], fib1))
		console.log(`Execution Time: ${performance1[i]} ms`)
		performance2.push(getPerformance(fibs[i], fib2))
		console.log(`Execution Time: ${performance2[i]} ms`)
		performance3.push(getPerformance(fibs[i], fib3))
		console.log(`Execution Time: ${performance3[i]} ms`)
		performance4.push(getPerformance(fibs[i], fib4))
		console.log(`Execution Time: ${performance4[i]} ms`)
		performance5.push(getPerformance(fibs[i], fib5))
		console.log(`Execution Time: ${performance5[i]} ms\n`)
	}

	// plot data ( x --> n , y --> performance[n] )
	const method1 = {x: fibs, y: performance1, type: 'line'}
	const method2 = {x: fibs, y: performance2, type: 'line'}
	const method3 = {x: fibs, y: performance3, type: 'line'}
	const method4 = {x: fibs, y: performance4, type: 'line'}
	const method5 = {x: fibs, y: performance5, type: 'line'}

	plot([
		method1,
		method2,
		method3,
		method4,
		method5
	]);
}

// input data set
// arrays with different values for n (nth digit of fib)
const bigData = [100, 300, 500, 700, 1000, 1200, 1300, 1500]
const mediumData = [50, 70, 100, 150, 250, 350, 450]
const smallData = [1, 5, 10, 15, 20, 25, 30]
runFib(smallData)
