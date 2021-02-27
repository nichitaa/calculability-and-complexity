/*
* Pasecinic Nichita
* FAF 192
* Teacher - Mihail Gaidau
* Lab 3
* 27.02.21
*/

const { performance } = require('perf_hooks');
const { plot } = require('nodeplotlib');
// decrease this value in order not to wait half of your life
const LIMIT = 10000; // if exceeded -> skip the method

const method1 = arr => {
	const start = performance.now();
	arr[1] = false;
	const n = arr.length;
	let i = 2;
	// i to arr.length
	while ( i <= n ) {
		// for true position only
		if ( arr[i] === true ) {
			// j <- 2i
			let j = 2 * i;
			// 2i to arr.length
			while ( j <= n ) {
				if ( performance.now() - start >= LIMIT ) {
					return null;
				}
				arr[j] = false;
				// j <- j + i
				j += i;
			}
		}
		i++;
	}
	return arr;
};

const method2 = arr => {
	const start = performance.now();
	const n = arr.length;
	arr[1] = false;
	let i = 2;
	// i to arr.length
	while ( i <= n ) {
		// for every position
		// j <- 2i
		let j = 2 * i;
		// 2i to arr.length
		while ( j <= n ) {
			if ( performance.now() - start >= LIMIT ) {
				return null;
			}
			arr[j] = false;
			// j <- j + i
			j += i;
		}
		i++;
	}
	return arr;
};

const method3 = arr => {
	const start = performance.now();
	const n = arr.length;
	arr[1] = false;
	let i = 2;
	// 2 to arr.length
	while ( i <= n ) {
		// only true position
		if ( arr[i] === true ) {
			// j <- i + 1
			let j = i + 1;
			// j to arr.length
			while ( j <= n ) {
				if ( performance.now() - start >= LIMIT ) {
					return null;
				}
				if ( j % i === 0 ) {
					arr[j] = false;
				}
				// j <- j + 1
				j++;
			}
		}
		i++;
	}
	return arr;
};

const method4 = arr => {
	const start = performance.now();
	const n = arr.length;
	arr[1] = false;
	let i = 2;
	// i (2) <- arr.length (i++)
	while ( i <= n ) {
		let j = 2;
		// j (2) <- i (j++)
		while ( j < i ) {
			if ( performance.now() - start >= LIMIT ) {
				return null;
			}
			if ( i % j === 0 ) {
				arr[i] = false;
			}
			j++;
		}
		i++;
	}
	return arr;
};

const method5 = arr => {
	const start = performance.now();
	const n = arr.length;
	arr[1] = false;
	let i = 2;
	// i (2) <- arr.length
	while ( i <= n ) {
		let j = 2;
		// j (2) <- radical of i
		while ( j <= Math.sqrt(i) ) {
			if ( performance.now() - start >= LIMIT ) {
				return null;
			}
			if ( i % j === 0 ) {
				arr[i] = false;
			}
			// j + 1
			j++;
		}
		// i + 1
		i++;
	}
	return arr;
};

const generateArray = n => new Array(n).fill(true);

const getPerformance = (cb, arr) => {
	const start = performance.now();
	const res = cb(arr);
	if ( !res ) {
		// return Number.MAX_SAFE_INTEGER;
		return Math.pow(10, 1000)
	}
	return performance.now() - start;
};

const run = (arrRange) => {
	const m1 = [];
	const m2 = [];
	const m3 = [];
	const m4 = [];
	const m5 = [];
	for ( let i = 0; i < arrRange.length; i++ ) {
		const arr = generateArray(arrRange[i]);
		console.log(`n=${arrRange[i]}`);
		
		const p1 = getPerformance(method1, arr);
		m1.push(p1);
		
		const p2 = getPerformance(method2, arr);
		m2.push(p2);
		
		const p3 = getPerformance(method3, arr);
		m3.push(p3);
		
		const p4 = getPerformance(method4, arr);
		m4.push(p4);
		
		const p5 = getPerformance(method5, arr);
		m5.push(p5);
		
	}
	
	const m1plot = { x: arrRange, y: m1, type: 'line', name: 'method1' };
	const m2plot = { x: arrRange, y: m2, type: 'line', name: 'method2' };
	const m3plot = { x: arrRange, y: m3, type: 'line', name: 'method3' };
	const m4plot = { x: arrRange, y: m4, type: 'line', name: 'method4' };
	const m5plot = { x: arrRange, y: m5, type: 'line', name: 'method5' };
	
	plot([
		m1plot,
		m2plot,
		m3plot,
		m4plot,
		m5plot,
	]);
	
	console.log(m1);
	console.log(m2);
	console.log(m3);
	console.log(m4);
	console.log(m5);
};

// range 10^2 - 10^7
const arrRange = [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];

run(arrRange);
