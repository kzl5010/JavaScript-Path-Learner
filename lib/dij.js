function pathTo(end) {
  let currentNode = end;
  let path = [];
  while (currentNode.parent) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

export const dij = {

  search: function(graph, start, end, options) {
    graph.clearNodes();

    let myStack = [];

    graph.markVisited(start);

    myStack.push(start);

    while (myStack.length > 0) {
      let currentNode = myStack.pop();

      if (currentNode === end) {
        return pathTo(currentNode);
      }
      if (currentNode === undefined) {
        return [];
      }

      currentNode.closed = true;

      let neighbors = graph.neighbors(currentNode);

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall()) {
          continue;
        }
        let beenVisited = neighbor.visited;

        if (!beenVisited) {
          myStack.push(neighbor);
          neighbor.visited = true;
          neighbor.parent = currentNode;
          graph.markVisited(neighbor);
        }
      }
    }

    return [];
  },
  cleanNode: function(node) {
    if (node === undefined) {
      return;
    }
    node.visited = false;
    node.closed = false;
    node.parent = null;
  }
};
