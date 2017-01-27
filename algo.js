function pathTo(end) {
  let currentNode = end;
  let path = [];
  while (currentNode.parent) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

function getHeap() {
  return new BinaryHeap(function(node) {
    return node.f;
  });
}

export const astar = {
  /**
  * Perform an A* Search on a graph given a start and end node.
  * @param {Graph} graph
  * @param {GridNode} start
  * @param {GridNode} end
  * @param {Object} [options]
  * @param {bool} [options.closest] Specifies whether to return the
             path to the closest node if the target is unreachable.
  * @param {Function} [options.heuristic] Heuristic function (see
  *          astar.algorithmic).
  */
  search: function(graph, start, end, options) {
    graph.clearNodes();
    options = options || {};
    let heuristic = astar.algorithmic.manhattan;
    let closest = options.closest || false;

    let heap = getHeap();
    let closestNode = start; // set the start node to be the closest if required

    start.h = heuristic(start, end);
    graph.markVisited(start);

    heap.push(start);

    while (heap.size() > 0) {
      let currentNode = heap.pop();

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

        let gScore = currentNode.g + neighbor.getCost(currentNode);
        let beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {

          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markVisited(neighbor);
          if (closest) {
            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
              closestNode = neighbor;
            }
          }

          if (!beenVisited) {
            heap.push(neighbor);
          } else {
            heap.rescoreElement(neighbor);
          }
        }
      }
    }

    if (closest) {
      return pathTo(closestNode);
    }

    return [];
  },
  algorithmic: {
    manhattan: function(pos0, pos1) {
      let d1 = Math.abs(pos1.x - pos0.x);
      let d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
    }
  },
  cleanNode: function(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
  }
};


function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    this.content.push(element);

    this.sinkDown(this.content.length - 1);
  },
  pop: function() {
    let result = this.content[0];
    let end = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function(node) {
    let i = this.content.indexOf(node);

    let end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  },
  size: function() {
    return this.content.length;
  },
  rescoreElement: function(node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function(n) {
    let element = this.content[n];

    while (n > 0) {

      let parentN = ((n + 1) >> 1) - 1;
      let parent = this.content[parentN];
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      }
      else {
        break;
      }
    }
  },
  bubbleUp: function(n) {
    let length = this.content.length;
    let element = this.content[n];
    let elemScore = this.scoreFunction(element);

    while (true) {
      let child2N = (n + 1) << 1;
      let child1N = child2N - 1;
      let swap = null;
      let child1Score;
      if (child1N < length) {
        let child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      if (child2N < length) {
        let child2 = this.content[child2N];
        let child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      else {
        break;
      }
    }
  }
}
