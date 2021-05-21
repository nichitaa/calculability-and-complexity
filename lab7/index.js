/**
 * Lab 7 - Floyd and Dijkstra Algorithms
 * FAF 192
 * Author - Pasecinic Nichita
 * 04.26.2021
 * */
const { performance } = require('perf_hooks');
const { plot } = require('nodeplotlib');

class Edge {
    constructor(v1, v2, w, floydFlag) {
        if(floydFlag) {
            this.v1 = parseInt(v1);
            this.v2 = parseInt(v2);
            this.w = parseInt(w);
        } else {
            this.v1 = v1;
            this.v2 = v2;
            this.w = w;
        }

    }
}

class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    addNode(node, floydFlag) {
        if(floydFlag) node = parseInt(node)
        if (!this.nodes.includes(node)) {
            this.nodes.push(node);
        }
    }

    addEdge(edge) {
        this.edges.push(edge)
    }

    //#region ******************** Floyd-Warshall ***************************

    /**
     * Makes the initial distances object for floyd algorithm
     * @returns {number} execution time
     * */
    floyd() {
        let dist = [];
        for(let i = 0; i < this.nodes.length; i++) {
            dist[i] = new Array(this.nodes.length);
        }

        // fill distance matrix with weight of the edge
        this.edges.forEach((e, i) => {
            dist[e.v1][e.v2] = e.w
            // fill in diagonal with 0
            if(i < this.nodes.length) dist[i][i] = 0
        })

        const startTime = performance.now()
        this._floyd(dist)
        const endTime = performance.now()

        return endTime - startTime
    }

    /**
     * Actual Floyd-Warshall Algorithm
     * */
    _floyd(dist) {
        for(let k = 0; k < this.nodes.length; k++) {
            for(let i = 0; i < this.nodes.length; i++) {
                for(let j = 0; j < this.nodes.length; j++) {
                    if(dist[i][j] === undefined) dist[i][j] = Infinity
                    if(dist[i][k] === undefined) dist[i][k] = Infinity
                    if(dist[k][j] === undefined) dist[k][j] = Infinity
                    // A[i, j] = min(A[i, j], A[i, k] + A[k, j])
                    if(dist[i][j] > dist[i][k] + dist[k][j]) dist[i][j] = dist[i][k] + dist[k][j]
                }
            }
            // console.log(`for k = ${k}`)
            // console.table(dist)
        }
        // console.log('\n\x1b[36m%s\x1b[0m', 'FLOYD');
        // console.table(dist)
    }

    //#endregion


    //#region ******************** Dijkstra Algorithm ********************

    /**
     * will bring from current this.edges:
     * [
     *   Edge { v1: 0, v2: 1, w: 3 },
     *   Edge { v1: 1, v2: 0, w: 8 },
     *   Edge { v1: 1, v2: 2, w: 2 },
     *   Edge { v1: 2, v2: 0, w: 5 },
     *   Edge { v1: 2, v2: 3, w: 1 },
     *   Edge { v1: 3, v2: 0, w: 2 },
     *   Edge { v1: 0, v2: 3, w: 7 }
     * ]
     * to object:
     * {
     *  '0': { '1': 3, '3': 7 },
     *  '1': { '0': 8, '2': 2 },
     *  '2': { '0': 5, '3': 1 },
     *  '3': { '0': 2 }
     * }
     * @returns {object}
     * */
    getDijkstraEdges() {
        const res = {}
        this.edges.forEach((e, i) => {
            if(!res[e.v1]) {
                res[e.v1] = {}
            }
            res[e.v1][e.v2] = e.w
        })
        // console.log(res)
        return res
    }

    /**
     *  Returns the smallest Node from given distances object
     *  @param {object} dist
     *  @param {Array} visited
     *  @returns {string}
     * */
    smallestWeightNode(dist, visited) {
        let res = ''
        let weight = Infinity
        for(let d in dist) {
            if(!visited.includes(d)) {
                const currentWeight = dist[d].weight
                if(currentWeight < weight) {
                    weight = currentWeight
                    res = d
                }
            }
        }
        if(res === '') throw new Error(`Something went wrong, there is no smallest weight edge in distances: ${dist}`)
        else return res
    }

    /**
     * Brings the edges to the necessary structure for Dijkstra algorithm
     * and makes the distance result object
     * @returns {number} execution time
     * */
    dijkstra() {
        const edges = this.getDijkstraEdges()
        let dist = {}
        this.nodes.forEach((n, i) => {
            if(i === 0) dist[n] = {weight: 0, prev: 'Start'}
            else dist[n] = {weight: Infinity, prev: undefined}
        })
        const startTime = performance.now()
        this._dijkstra(edges, dist)
        const endTime = performance.now()

        return endTime - startTime
    }

    /**
     * Actual algorithm
     * */
    _dijkstra(edges, dist) {
        const visited = []
        while(visited.length !== this.nodes.length) {
            // get the smallest weight node from current distances result
            const smallestNode = this.smallestWeightNode(dist, visited)
            const smallestNodeNeighbours = edges[smallestNode]
            // iterate over it's unvisited neighbours
            for(let node in smallestNodeNeighbours) {
                if(!visited.includes(node)) {
                    // sum = currentSmallestEdgeWeight + currentEdgeWeight
                    let sum = dist[smallestNode].weight + smallestNodeNeighbours[node]
                    if(sum < dist[node].weight) {
                        dist[node].weight = sum
                        dist[node].prev = smallestNode.toString()
                    }
                }
            }
            visited.push(smallestNode.toString())
            // console.log({edges, dist, visited, smallestNode})
        }
        // console.log('\n\x1b[36m%s\x1b[0m', 'DIJKSTRA');
        // console.table(dist)
    }

    //#endregion
}


/**
 * Same util function to make a random connected graph [from lab4]
 */
const randomNumber = (min = 10, max = 100000) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const makeGraph = (nrOfVertices = 10, nrOfAdditionalConnections = 10, max = nrOfVertices, min = 0) => {
    const vertices = [];
    const edges = [];

    const gDijkstra = new Graph();
    const gFloyd = new Graph()

    for (let i = 0; i <= nrOfVertices; i++) {
        vertices.push(i.toString());
        gDijkstra.addNode(i.toString(), false);
        gFloyd.addNode(i, true);
    }

    // make a path
    for (let i = 0; i < vertices.length - 1; i++) {
        gDijkstra.addEdge(new Edge(vertices[i], vertices[i + 1], randomNumber(), false));
        gFloyd.addEdge(new Edge(vertices[i], vertices[i + 1], randomNumber(), true));
        edges.push([vertices[i], vertices[i + 1]]);
    }
    const edgeExists = (u, v) => {
        for (let i = 0; i < edges.length; i++) {
            if (edges[i][0] === u && edges[i][1] === v) return true;
        }
        return false;
    };
    while (nrOfAdditionalConnections !== 0) {
        const u = vertices[Math.floor(Math.random() * vertices.length)];
        const v = vertices[Math.floor(Math.random() * vertices.length)];
        if (edges.length === 0) {
            gDijkstra.addEdge(new Edge(u, v, randomNumber()));
            gFloyd.addEdge(new Edge(u, v, randomNumber(), true));
            edges.push([u, v]);
            nrOfAdditionalConnections--;
        } else {
            if (!edgeExists(u, v)) {
                gDijkstra.addEdge(new Edge(u, v, randomNumber()));
                gFloyd.addEdge(new Edge(u, v, randomNumber(), true));
                edges.push([u, v]);
                nrOfAdditionalConnections--;
            }
        }
    }
    const floydTime = gFloyd.floyd();
    console.log('floyd time: ', floydTime);
    const dijkstraTime = gDijkstra.dijkstra();
    console.log('dijkstra time: ', dijkstraTime);
    // console.log('edges: ');
    // console.table(gDijkstra.edges)
    // console.log('nodes: ');
    // console.table(gDijkstra.nodes)
    // console.log('floyd table')
    // console.table(gFloyd.nodes)
    // console.table(gFloyd.edges)
    return { floydTime, dijkstraTime };
};


const run = (vs, es) => {
    const floydPerf = [];
    const dijkstraPerf = [];
    for (let i = 0; i < vs.length; i++) {
        console.log('\n********************');
        console.log('running for: ', vs[i], 'edges: ', es[i]);
        const { floydTime, dijkstraTime } = makeGraph(vs[i], es[i]);
        floydPerf.push(floydTime);
        dijkstraPerf.push(dijkstraTime);
        console.log('********************');
    }

    const floydPlot = { x: vs, y: floydPerf, type: 'line', name: 'floyd execution time' };
    const dijkstraPlot = { x: vs, y: dijkstraPerf, type: 'line', name: 'dijkstra execution time' };
    plot([floydPlot, dijkstraPlot]);
};


const nrOfVertices = [10, 50, 100, 500, 1000];
const nrOfAdditionalConnections = [10, 50, 100, 1000, 2000];
run(nrOfVertices, nrOfAdditionalConnections);

// let g = new Graph();

// Floyd graph example from: https://www.youtube.com/watch?v=oNI0rf2P9gE&t=319s
// g.addNode(0);
// g.addNode(1);
// g.addNode(2);
// g.addNode(3);
//
// g.addEdge(new Edge(0, 1, 3));
// g.addEdge(new Edge(1, 0, 8));
// g.addEdge(new Edge(1, 2, 2));
// g.addEdge(new Edge(2, 0, 5));
// g.addEdge(new Edge(2, 3, 1));
// g.addEdge(new Edge(3, 0, 2));
// g.addEdge(new Edge(0, 3, 7));

// Dijkstra graph example here: https://www.youtube.com/watch?v=pVfj6mxhdMw
// !Note - can not run floyd on this one as it's nodes are string
// g.addNode('A');
// g.addNode('B');
// g.addNode('C');
// g.addNode('D');
// g.addNode('E');
//
// g.addEdge(new Edge('A', 'D', 1));
// g.addEdge(new Edge('A', 'B', 6));
// g.addEdge(new Edge('D', 'B', 2));
// g.addEdge(new Edge('D', 'E', 1));
// g.addEdge(new Edge('E', 'B', 2));
// g.addEdge(new Edge('E', 'C', 5));
// g.addEdge(new Edge('B', 'C', 5));

// console.log({Nodes: g.nodes, Edges: g.edges})

// const dijkstraTime = g.dijkstra()
// const floydTime = g.floyd()
// console.log({floydTime, dijkstraTime})


