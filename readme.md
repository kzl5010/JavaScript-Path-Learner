# JavaScript Path Learner

[JavaScript Path Learner](https://js-maze-solver.herokuapp.com/) is a JavaScript project designed to help learn algorithms. It is created with JavaScript, jQuery, HTML5, and styled with CSS3.

<!-- ![Home page](docs/images/home.png) -->

## Features
- [x] Generate mazes and choose size
- [x] Set start and end points
- [x] Choose algorithm to visualize
- [x] Instructions
- [x] Specify weighted vs. unweighted

## Design
This visualizer features a tailored random grid. To run an algorithm the user chooses start and end points after specifying the details of the grid.

<!-- ![AStar with path](docs/images/astar-path.png) -->

The top of the screen contains instructions. There are user controlled options for algorithm to run, grid size, obstacle density, and grid weight. The visualizer displays the path from the start node to the end node with the option to view all the visited tiles after the search. The path is the shortest path calculated using the algorithm chosen.
<!--
![20x20 grid](docs/images/small-grid.png) -->

The visualizer supports different grid sizes based on user preference. The **Generate Maze** button allows the user to generate randomized mazes as desired.

<!-- ![Breadth first](docs/images/breadth-first-spread.png) -->

As the algorithm runs almost instantly, `setTimeout` methods were used the build the visited nodes on screen. Later, the path is also drawn with a calculated timeout.
<!--
![Breadth first done](docs/images/depth-first-done.png) -->

After one second pass, the grid is ready to run another search.

<!-- ```javascript
showActive(path, i) {
  this.getElement(path[i]).addClass("path");
  setTimeout(() => {
    if (i < path.length - 2)
      this.showActive(path, i+1);
  }, 800/this.gridSize);
}
``` -->

## Algorithms

The site supports two algorithms: Breadth-first search and A* search. These are implemented as path-finding algorithms moving in an North, East, South, West pattern
with more coming in the future. A* is currently implement using the following manhattan heuristic to estimate distance costs from one node to another:

```javascript
 manhattan(p1, p2) {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  return dx + dy;
}
```

### A* Search

The A* algorithm was implemented with arrays acting as the open and closed sets. Graph nodes were stored in a class and a binary heap was used to determine the lowest cost path from the start to the endpoint.

<!-- ```javascript
// Here the lowest scored node is found for the next visit
for (let i = 0; i < openSet.length; i++) {
  if (openSet[i].f < openSet[lowestInd].f)
    lowestInd = i;
}

...

// With all the neighbors of our currentNode, we calculate gScores
// accordingly and update fScores but using Manhattan distances.
for (let i = 0; i < neighbors.length; i++) {
  let n = neighbors[i];

  if (n.closed || n.weight === 0)
    continue;

  let gScore = currNode.g + 1;
  let bestGScore = false;

  if (!n.visited) {
    bestGScore = true;
    n.visited = true;
    n.h = AStar.manhattan(n.pos, this.end.pos);
    openSet.push(n);
  } else if (gScore < n.g) {
    bestGScore = true;
  }

  if (bestGScore) {
    n.parent = currNode;
    n.g = gScore;
    n.f = n.g + n.h;
  }
}
``` -->

### Breadth-first Search

BFS here was implemented with an array as a queue. Nodes were pushed into a closed set once it was visited and the search worked by adding neighbors of the most recent node popped from the queue until the queue was empty.
<!-- ```javascript
currNode.closed = true;
closedSet.push(currNode);

let neighbors = graph.neighbors(currNode);
for (let i = 0; i < neighbors.length; i++) {
  let n = neighbors[i];

  if (n.closed || n.weight === 0)
    continue;

  if (!n.visited) {
    n.visited = true;
    n.parent = currNode;
    queue.push(n);
  }
}
``` -->
<!--
### Depth-first Search

For this project, DFS was implemented with an array as the stack. To find the path associated with the proper nodes, we also had to have a "path cache" array stored with the node:

```javascript
// Each stack push will be an array of two things:
// 1. The node
// 2. The current path that leads to the node
let stack = [[start, []]];
```

As with BFS and A*, we visit nodes and push it into our storage:

```javascript
for (let i = 0; i < neighbors.length; i++) {
  let n = neighbors[i];

  if (n.weight === 0)
    continue;

  // Storage here looks different with the extra arrays
  if (n.x === end.x && n.y === end.y) {
    return { path: currPath.concat([n]), closedSet: closedSet.concat([currNode]) };
  }

  if (!n.visited) {
    n.visited = true;
    n.parent = currNode;
    stack.push([n, currPath.concat([n])]);
  }
} -->
<!-- ``` -->

## Future

Here are some features that I would like to implement in the future:
- [ ] Fix known bug of user clicking while the algorithm is still running disrupting things.
- [ ] The path draws all the nodes as it visits them instead of after
- [ ] More algorithms Kruskal's, Dijkstra's, and Prim's
- [ ] User drawable mazes
- [ ] Different heuristics and allowing diagonals
- [ ] More direct algorithmic comparisons, like running two at the same time using different colors
