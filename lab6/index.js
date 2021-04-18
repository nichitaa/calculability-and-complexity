/**
 * Lab 6 - Kruskal and Prim algorithms
 * FAF 192
 * Pasecinic Nichita
 * 04.08.2021
 * */

const { performance } = require('perf_hooks');

class Edge {
    constructor(v1, v2, w) {
        this.v1 = v1;
        this.v2 = v2;
        this.w = w;
    }
}

class Graph {
    constructor() {
        this.edges = [];
        this.nodes = [];
    }

    addEdge(edge) {
        this.edges.push(edge);
        if (!this.nodes.includes(edge.v1)) {
            this.nodes.push(edge.v1);
        }
        if (!this.nodes.includes(edge.v2)) {
            this.nodes.push(edge.v2);
        }
    }

    sortByWeight() {
        // decided not to mutate the original edges array to be fair for both algorithms
        // so time for sorting will be including for both algorithms
        const sorted = [...this.edges];
        sorted.sort((e1, e2) => {
            if (e1.w === e2.w) return 1;
            return e1.w < e2.w ? -1 : 1;
        });
        return sorted;
    }

    /**
     * Kruskal Algorithm
     * */

    find(subsets, n) {
        let nodeInfo = subsets.get(n);
        if (nodeInfo.parent !== n) {
            nodeInfo.parent = this.find(subsets, nodeInfo.parent);
        }
        return nodeInfo.parent;
    }

    // unite the x and y subsets based on rank
    union(subsets, x, y) {
        let xroot = this.find(subsets, x);
        let yroot = this.find(subsets, y);

        if (subsets.get(xroot).rank < subsets.get(yroot).rank) {
            subsets.get(xroot).parent = yroot;
        } else if (subsets.get(xroot).rank > subsets.get(yroot).rank) {
            subsets.get(yroot).parent = xroot;
        } else {
            subsets.get(yroot).parent = xroot;
            subsets.get(xroot).rank++;
        }
    }

    kruskal() {

        let subsets = new Map();
        let result = [];
        let cost = 0;

        let edges = this.sortByWeight();

        // set priority queue nodes
        this.nodes.forEach(node => {
            subsets.set(node, {parent: node, rank: 0})
        });

        let i = 0;
        let j = 0;

        // console.log({initialSubsets: subsets})
        // console.log({initialEdges: this.edges})

        // while not all vertices traversed
        while (j < this.nodes.length - 1) {
            let edge = edges[i++];
            let root1 = this.find(subsets, edge.v1);
            let root2 = this.find(subsets, edge.v2);
            // console.log({currentEdge: edge, root1, root2})

            // if there is not a cycle
            if (root1 !== root2) {
                // console.log("EDGE ADDED - ", edge)
                // update result
                result[j++] = edge;
                cost += edge.w;
                this.union(subsets, root1, root2);
            }
        }

        // console.log('\n\x1b[36m%s\x1b[0m', 'KRUSKAL');
        // console.table(result);
    }

    /**
    * Prim Algorithm
    **/

    getNextEdge(visited, visitedBool, sortedEdges) {
        for(let i = 0; i < visited.length; i++) {
            for(let j = 0; j < sortedEdges.length; j++) {
                let edge = sortedEdges[j]
                // only if the edge was not visited yet (not added to result)
                if(!visitedBool[j]) {
                    if(!visited.includes(edge.v1) && visited.includes(edge.v2)) {
                        // console.log({return1: edge})
                        // return the cortege of [edge tb added, edge idx, new vertex tb included in visited]
                        return [edge, j, edge.v1];
                    }
                    if(visited.includes(edge.v1) && !visited.includes(edge.v2)) {
                        // console.log({return1: edge})
                        return [edge, j, edge.v2];
                    }
                }
            }
        }
    }

    prim() {

        let visited = []; // arr of strings ( vertices aka nodes )
        let result = [];  // arr of Edges ( final result )
        // arr of bool ( if the Edge will be added to result update this correspondingly by Edge index )
        let visitedEdgesBool = new Array(this.edges.length).fill(false);

        let edges = this.sortByWeight();

        // get smallest weight edge ( from sorted edges will be the first Edge )
        let startEdge = edges[0];
        // update result
        visited.push(startEdge.v1, startEdge.v2);
        visitedEdgesBool[0] = true;
        result.push(startEdge);

        // while not all nodes are visited
        while(result.length !== this.nodes.length - 1) {
            // get next edge, it's index and new vertex from it
            let [nextEdge, edgeIdx, newVertex] = this.getNextEdge(visited, visitedEdgesBool, edges);
            // update result
            visitedEdgesBool[edgeIdx] = true;
            visited.push(newVertex);
            result.push(nextEdge);
            // console.log({nextEdge, edgeIdx, newVertex})
        }

        // console.log('\n\x1b[36m%s\x1b[0m', 'PRIM');
        // console.table(result);

    }

    kruskalExecTime() {
        const start = performance.now();
        this.kruskal()
        const end = performance.now();
        return end - start;
    }

    primExecTime() {
        const start = performance.now();
        this.prim()
        const end = performance.now();
        return end - start;
    }

}

const g = new Graph();

// g.addEdge(new Edge('A', 'B', 2));
// g.addEdge(new Edge('A', 'C', 3));
// g.addEdge(new Edge('A', 'D', 4));
// g.addEdge(new Edge('A', 'E', 4));
//
// g.addEdge(new Edge('B', 'C', 3));
// g.addEdge(new Edge('C', 'D', 4));
// g.addEdge(new Edge('D', 'E', 2));


g.addEdge(new Edge('A', 'B', 2));
g.addEdge(new Edge('A', 'C', 3));
g.addEdge(new Edge('A', 'D', 3));

g.addEdge(new Edge('B', 'C', 4));
g.addEdge(new Edge('B', 'E', 3));

g.addEdge(new Edge('C', 'D', 5));
g.addEdge(new Edge('C', 'F', 6));
g.addEdge(new Edge('C', 'E', 1));

g.addEdge(new Edge('E', 'F', 8));

g.addEdge(new Edge('D', 'F', 7));

g.addEdge(new Edge('F', 'G', 9));


console.log('kruskal: ' + g.kruskalExecTime());
console.log('prim: ' + g.primExecTime());

// console.log({Edges: g.edges});
// console.log({Nodes: g.nodes});

