
/*
The main idea in these algorithms will be to first implement the functions that
provide the actual solution, and then implement functions that will visualize
these solutions by altering the classname of each explored node in order to
colorize which nodes are in progress, which ones are visited, and ultimately 
highlight the final path. The animation will be taken care of in
PathfindingVisualizer, while we provide the actual backend of the algorithms here.
*/

// Dijkstra's algorithm: takes in a grid of nodes, along with start and finish,
// and checks two nodes u,v if it's cheaper/more efficient to move
// from node u to v instead of the path v already has.
// Also updates each node with a pointer to its predecessor.
export function dijkstraSearch(grid, startNode, finishNode) {

    const queue = getAllNodes(grid);
    const visitedNodesInOrder = [];
    
    // equivalent to (queue && queue.length)
    while (queue?.length) {
        //debugger;

        
        // Because of the sorting, this node is guaranteed to have the lowest distance
        const currentNode = queue.shift();

        // If a wall is encountered, skip the node
        if (currentNode.isWall) continue;

        
        // If we end up here, then we are trapped, and therefore return the list of nodes
        if (currentNode.distance === Infinity) {
            return visitedNodesInOrder;
        }
        // Break if we have found the target (might delete later to calculate all-to-all)
        if (currentNode === finishNode) {
            return visitedNodesInOrder;
        }
        
        // Get all neighbours of current node
        const currentNeighbours = getNeighbours(grid, currentNode);
        visitedNodesInOrder.push(currentNode);
        // Iterate through neighbours and relax the edges
        for (let neighbour of currentNeighbours) {
            relax(currentNode, neighbour);
        }
        queue.sort((n1, n2) => n1.distance - n2.distance);
    }
}

// Relax an edge between u and v:
// if (u.distance + cost(go from u to v) < v.distance)
// => v.distance = u.distance cost(go from u to v);
// => v.predecessor = u;
function relax(currentNode, neighbour) {
    const tempDistance = currentNode.distance + neighbour.cost;
        if (tempDistance < neighbour.distance) {
            neighbour.distance = tempDistance;
            neighbour.predecessor = currentNode;
        }
}


function getNeighbours(grid, node) {
    const {row, col} = node;
    const maxRowIndex = grid.length - 1;
    const maxColIndex = grid[0].length - 1;

    const topNeighbour = (row > 0) ? grid[row-1][col] : null;
    const bottomNeighbour = (row < maxRowIndex) ? grid[row+1][col] : null;
    const rightNeighbour = (col < maxColIndex) ? grid[row][col+1] : null;
    const leftNeighbour = (col > 0) ? grid[row][col-1] : null;

    // List in order of what nodes will be searched first: top, right, bottom, left
    const neighbourList = [topNeighbour, rightNeighbour, bottomNeighbour, leftNeighbour];

    // Filter out null-nodes, visited nodes, wall nodes, and sort the list
    // where nodes with minimal distance will appear first
    const result = neighbourList
        .filter(checkNode)
        .sort((n1, n2) => n1.distance - n2.distance);
    return result;
}

// Check if a node is null, visited, or a wall
function checkNode(node) {
    if (node === null) {
        return false;
    }
    if (node.isVisited) {
        return false;
    }
    if (node.isWall) {
        return false;
    }
    return true;
}

// Returns a sorted list of all nodes in the grid where the sorting
// is based on the distance of each node
function getAllNodes(grid) {
    const nodeList = [];
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
            nodeList.push(row[j]);
        }
    }
    const result = nodeList.sort((n1, n2) => n1.distance - n2.distance);
    return result;
}

// Backtrack the shortest path. Must be called after dijkstraSearch
export function getShortestPath (finishNode) {
    const result = [];
    let currentNode = finishNode;
    while (currentNode.predecessor) {
        result.push(currentNode);
        currentNode = currentNode.predecessor;
    }
    return result;
}