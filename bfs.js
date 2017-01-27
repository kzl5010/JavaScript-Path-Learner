function pathTo(end) {
  let currentNode = end;
  let path = [];
  while (currentNode.parent) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

export const bfs = {

  search: function(graph, start, end, options) {
    graph.clearNodes();
    let closest = options.closest || false;

    let mySet = new Set();
    let myQueue = [];
    let closestNode = start; // set the start node to be the closest if required

    graph.markVisited(start);

    myQueue.push(start);

    while (myQueue.length > 0) {
      let currentNode = myQueue.shift();

      if (currentNode === end) {
        return pathTo(currentNode);
      }

      currentNode.closed = true;

      let neighbors = graph.neighbors(currentNode);

      for (let i = 0, il = neighbors.length; i < il; ++i) {
        let neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall()) {
          continue;
        }
        let beenVisited = neighbor.visited;

        if (!beenVisited) {
          myQueue.push(neighbor);
          neighbor.visited = true;
          neighbor.parent = currentNode;
          graph.markVisited(neighbor);
        }
      }
    }

    if (closest) {
      return pathTo(closestNode);
    }

    return [];
  },
  cleanNode: function(node) {
    node.visited = false;
    node.closed = false;
    node.parent = null;
  }
};
