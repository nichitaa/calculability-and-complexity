/*
* Pasecinic Nichita
* FAF 192
* Teacher - Mihail Gaidau
* Lab 2
* 19.02.21
*/

const { plot } = require('nodeplotlib');
const { performance } = require('perf_hooks');

/*
The average case for the Quick Sort Algorithm is O(n log n)
where n is the length of an array.
But the worst case is O(n^2).
In order to achieve the average case, we need to choose a random pivot each time.
 */
const quickSort = arr => {
	if ( arr.length < 2 ) return arr;
	let min = 1;
	let max = arr.length - 1;
	
	let rand = Math.floor(min + Math.random() * (max + 1 - min)); // random index
	let pivot = arr[rand]; // get value at rand index
	
	const left = [];
	const right = [];
	
	arr.splice(arr.indexOf(pivot), 1);
	arr = [pivot].concat(arr); // set pivot as first element in new arr
	
	for ( let i = 1; i < arr.length; i++ ) {
		if ( pivot > arr[i] ) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}
	return quickSort(left).concat(pivot, quickSort(right));
};


/*
The worst-case time complexity of Merge Sort is O(n*logn),
same as that for best case time complexity for Quick Sort.
The space complexity of the merge sort is O(n).
*/
const merge = (left, right) => {
	let arr = [];
	
	while ( left.length && right.length ) {
		if ( left[0] < right[0] ) {
			// shift -> removes first el in array
			arr.push(left.shift());
		} else {
			arr.push(right.shift());
		}
	}
	
	return [...arr, ...left, ...right];
};

const mergeSort = arr => {
	const arrayCopy = [...arr];
	
	const half = arrayCopy.length / 2;
	
	if ( arrayCopy.length < 2 ) {
		return arrayCopy;
	}
	
	const left = arrayCopy.splice(0, half);
	return merge(mergeSort(left), mergeSort(arrayCopy));
};


/*
The time complexity to build max-heap is O(n).
Time complexity depends on the number of swaps and comparisons made.
As we started building max-heap from index 2 therefore loop runs for n/2 times.
For the elements at 1 and 2 index, two comparisons are made with each of their
children but only one swap is performed for them. Therefore, for one swap there
are two comparisons as the loop runs n/2 times therefore for n/2 swaps there are n comparisons.
Therefore Time Complexity = O(n/2 +n) = O(n).
*/

const maxHeap = (arr, i, l) => {
	const left = 2 * i + 1;
	const right = 2 * i + 2;
	let max = i;
	if ( left < l && arr[left] > arr[max] ) {
		max = left;
	}
	
	if ( right < l && arr[right] > arr[max] ) {
		max = right;
	}
	
	if ( max !== i ) {
		swap(arr, i, max);
		maxHeap(arr, max, l);
	}
};

const swap = (arr, a, b) => {
	const temp = arr[a];
	arr[a] = arr[b];
	arr[b] = temp;
};

const heapSort = arr => {
	const arrCopy = [...arr];
	let l = arrCopy.length;
	
	for ( let i = Math.floor(l / 2); i >= 0; i -= 1 ) {
		maxHeap(arrCopy, i, l);
	}
	
	for ( let i = arrCopy.length - 1; i > 0; i-- ) {
		swap(arrCopy, 0, i); // swap the sorted element from heap with last one
		l--;
		maxHeap(arrCopy, 0, l); // rebuild heap
	}
	return arrCopy;
};


/*
Counting sort takes O(n + k) time.
We iterate through the input items twice—once to populate counts and once to fill
in the output array. Both iterations are O(n) time.
Additionally, we iterate through counts once to fill in nextIndex, which is O(k) time.
I did actually combine counts and nextIndex into one array.
No asymptotic changes, but it does save O(k) space. But instead
I made a copy of original array to work with and return it
and just not to mutate it, but it can be done without it
and mutate original array.

In many cases cases, k is O(n) the number of items to be sorted is not asymptotically
different than the number of values those items can take on.
Because of this, counting sort is often said to be O(n)O(n) time and space.

Note Counting sort mb is the worst sorting algorithm for the data with a big range of
values, and is pretty optimized for small range of numbers for data to be sorted
*/


const countingSort = (arr) => {
	// find range
	// const min = Math.min(...arr);
	// const max = Math.max(...arr);
	// in build min && max are limited to an array with 125k digits
	// a work around would be sorting the array
	// and getting the first and last element
	// for sorting, I used .sort which is optimized quicksort
	const sorted = arr.sort((a, b) => a - b);
	const min = sorted[0];
	const max = sorted[sorted.length - 1];
	
	const arrCopy = [...arr];
	
	// make occurrence arr
	const count = [];
	for ( let i = min; i <= max; i++ ) {
		count[i] = 0;
	}
	for ( let i = 0; i < arrCopy.length; i++ ) {
		count[arrCopy[i]]++;
	}
	
	let m = 0;
	for ( let i = min; i <= max; i++ ) {
		// iterate over count arr
		while ( count[i]-- > 0 ) {
			// i - value from arr to sort
			// z - position in sorted arr
			arrCopy[m++] = i;
		}
	}
	
	return arrCopy;
};


/*##############################################################*/
/*################### Compute Time Complexity ##################*/

const getPerformanceTime = (arr, cb) => {
	const start = performance.now();
	cb(arr);
	const end = performance.now();
	return end - start;
};

const generateArrData = (min, max, n) => {
	const arr = [];
	while ( arr.length < n ) {
		const rand = Math.floor(Math.random() * (max - min) + min);
		arr.push(rand);
	}
	return arr;
};

const run = (n) => {
	const quicksort = [];
	const heapsort = [];
	const mergesort = [];
	const counting = [];
	
	for ( let i = 0; i < n.length; i++ ) {
		const arr = generateArrData(1, 100000, n[i]);
		console.log(`for n = ${n[i]}:`);
		
		const q = getPerformanceTime(arr, quickSort)
		console.log(`quicksort - ${q} ms`);
		quicksort.push(q);
		
		const h = getPerformanceTime(arr, heapSort)
		console.log(`heapsort - ${h} ms`);
		heapsort.push(h);
		
		const m = getPerformanceTime(arr, mergeSort)
		console.log(`mergesort - ${m} ms`);
		mergesort.push(m);
		
		const c = getPerformanceTime(arr, countingSort)
		console.log(`countingsort - ${c} ms`);
		counting.push(c);
	}
	
	const qs = { x: n, y: quicksort, type: 'line' };
	const hs = { x: n, y: heapsort, type: 'line' };
	const ms = { x: n, y: mergesort, type: 'line' };
	const cs = { x: n, y: counting, type: 'line' };
	
	plot([
		qs,
		hs,
		ms,
		cs,
	]);
};

const n = [100, 500, 1000, 5000, 10000, 50000, 100000];
const bn = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]

run(bn);


