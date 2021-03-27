/*
* Lab 4 - DFS & BFS 
* FAF - 192 
* Pasecinic Nichita
* 25.03.21
*/

const { performance } = require('perf_hooks');
const { plot } = require('nodeplotlib');

class Graph {

    constructor() {
        this.graph = {};
        this.vertices = [];
    }

    addEdge = (u, v) => {
        if (this.vertices.indexOf(u) === -1) this.vertices.push(u);
        if (this.vertices.indexOf(v) === -1) this.vertices.push(v);
        if (this.graph[u] !== undefined) this.graph[u] = [...this.graph[u], v];
        else this.graph[u] = [v];
    };

    dfsTime = (s) => {
        const visited = new Set();

        const start = performance.now();
        this.dfs(s, visited);
        const end = performance.now();

        return end - start;
    };

    dfs = (v, visited) => {

        visited.add(v);
        // console.log(v); // <-- the visited vertex

        if (this.graph[v]) {
            for (let next of this.graph[v]) {
                if (!visited.has(next)) {
                    this.dfs(next, visited);
                }
            }
        }

    };

    bfsTime = (s) => {
        let visited = {};
        for (let node of this.vertices) visited[node] = false;

        const start = performance.now();
        this.bfs(s, visited);
        const end = performance.now();

        return end - start;
    };

    bfs = (s, visited) => {

        const queue = [];
        queue.push(s);
        visited[s] = true;

        while (queue.length !== 0) {
            const current = queue.shift();
            // console.log(current); // <-- the visited vertex
            if (this.graph[current]) {
                for (let next of this.graph[current]) {
                    if (visited[next] === false) {
                        queue.push(next);
                        visited[next] = true;
                    }
                }
            }
        }

    };

}

// makes a rand graph of n vertices and e edges, besides the path ones
const makeGraph = (nrOfVertices = 10, nrOfAdditionalConnections = 10, max = nrOfVertices, min = 0) => {
    const vertices = []; // [0...nrOfVertices]
    const edges = [];
    const g = new Graph();

    for (let i = 0; i <= nrOfVertices; i++) {
        // can be used random nrs for vertices but no need to (anyway dfs is faster)
        // const rand = (Math.floor(Math.random() * (max - min + 1) + min)).toString();
        // vertices.push(rand);
        vertices.push(i.toString());
    }

    // make a path
    for (let i = 0; i < vertices.length - 1; i++) {
        g.addEdge(vertices[i], vertices[i + 1]);
        edges.push([vertices[i], vertices[i + 1]]);
    }

    // util to check if the new edge already exists
    const edgeExists = (u, v) => {
        for (let i = 0; i < edges.length; i++) {
            if (edges[i][0] === u && edges[i][1] === v) return true;
        }
        return false;
    };

    // complete the graph
    while (nrOfAdditionalConnections !== 0) {

        const u = vertices[Math.floor(Math.random() * vertices.length)];
        const v = vertices[Math.floor(Math.random() * vertices.length)];

        if (edges.length === 0) {
            g.addEdge(u, v);
            edges.push([u, v]);
            nrOfAdditionalConnections--;
        } else {
            if (!edgeExists(u, v)) {
                g.addEdge(u, v);
                edges.push([u, v]);
                nrOfAdditionalConnections--;
            }
        }
    }

    const dfsTime = g.dfsTime(vertices[0]);

    const bfsTime = g.bfsTime(vertices[0]);

    return { dfsTime, bfsTime };
};


const run = (vs, es) => {
    const dfsPerf = [];
    const bfsPerf = [];
    for (let i = 0; i < vs.length; i++) {
        const { dfsTime, bfsTime } = makeGraph(vs[i], es[i]);
        dfsPerf.push(dfsTime);
        bfsPerf.push(bfsTime);
        console.log('********************');
        console.log('vertices: ', vs[i], 'edges: ', es[i]);
        console.log('dfs time: ', dfsTime);
        console.log('bfs time: ', bfsTime);
        console.log('********************');
    }

    const dfsPlot = { x: vs, y: dfsPerf, type: 'line', name: 'dfs execution time' };
    const bfsPlot = { x: vs, y: bfsPerf, type: 'line', name: 'bfs execution time' };
    plot([dfsPlot, bfsPlot]);
};


const nrOfVertices = [10, 50, 100, 500, 1000, 2000, 3000];
const nrOfAdditionalConnections = [10, 50, 100, 1000, 5000, 20000, 20000];
run(nrOfVertices, nrOfAdditionalConnections); // test run

// single test run
// const {dfsTime, bfsTime} = makeGraph(5000, 20000);
// console.log("dfs time: ", dfsTime);
// console.log("bfs time: ", bfsTime);

/*
*
* Observation
* ! [int, int] - [nrOfVertices, nrOfAdditionalConnections]
* 
* - when nrOfVertices === nrOfAdditionalConnections: 
* [100, 100]    - dfs - 0.22ms  | bfs - 0.23ms      ( dfs faster )    
* [1000, 1000]  - dfs - 1.45ms  | bfs - 1.15ms      ( bfs faster )
* [5000, 5000]  - dfs - 11.40ms | bfs - 13.35ms     ( dfs faster )    
* 
* - when nrOfVertices < nrOfAdditionalConnections: 
* [10, 100]     - dfs - 0.15ms  | bfs - 0.16ms      ( dfs faster )    
* [100, 1000]   - dfs - 0.384ms | bfs - 0.384ms     ( equal )
* [1000, 5000]  - dfs - 2.15ms  | bfs - 1.81ms      ( bfs faster )
* [5000, 20000] - dfs - 30.5ms  | bfs - 11.19ms     ( bfs considerably faster )
* 
* - when nrOfVertices > nrOfAdditionalConnections: 
* [100, 10]     - dfs - 0.1ms   | bfs - 0.2ms       ( dfs faster )
* [1000, 100]   - dfs - 1.2ms   | bfs - 1.9ms       ( dfs faster ) 
* [5000, 1000]  - dfs - 14.5ms  | bfs - 12.5ms      ( bfs faster )
* 
*/

// for my approach:
// Time Complexity of BFS = O(V+E) where V is vertices and E is edges.
// Since all the nodes and vertices are visited, the average time complexity
// for DFS on a graph is O(V + E), where V is the number of vertices 
// and E is the number of edges. In case of DFS on a tree, the time complexity 
// is O(V), where V is the number of nodes.