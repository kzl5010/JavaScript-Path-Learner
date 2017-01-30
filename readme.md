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
function A*(start, goal)
    // The set of nodes already evaluated.
    closedSet := {}
    // The set of currently discovered nodes that are already evaluated.
    // Initially, only the start node is known.
    openSet := {start}
    // For each node, which node it can most efficiently be reached from.
    // If a node can be reached from many nodes, cameFrom will eventually contain the
    // most efficient previous step.
    cameFrom := the empty map

    // For each node, the cost of getting from the start node to that node.
    gScore := map with default value of Infinity
    // The cost of going from start to start is zero.
    gScore[start] := 0 
    // For each node, the total cost of getting from the start node to the goal
    // by passing by that node. That value is partly known, partly heuristic.
    fScore := map with default value of Infinity
    // For the first node, that value is completely heuristic.
    fScore[start] := heuristic_cost_estimate(start, goal)

    while openSet is not empty
        current := the node in openSet having the lowest fScore[] value
        if current = goal
            return reconstruct_path(cameFrom, current)

        openSet.Remove(current)
        closedSet.Add(current)
        for each neighbor of current
            if neighbor in closedSet
                continue		// Ignore the neighbor which is already evaluated.
            // The distance from start to a neighbor
            tentative_gScore := gScore[current] + dist_between(current, neighbor)
            if neighbor not in openSet	// Discover a new node
                openSet.Add(neighbor)
            else if tentative_gScore >= gScore[neighbor]
                continue		// This is not a better path.

            // This path is the best until now. Record it!
            cameFrom[neighbor] := current
            gScore[neighbor] := tentative_gScore
            fScore[neighbor] := gScore[neighbor] + heuristic_cost_estimate(neighbor, goal)

    return failure

function reconstruct_path(cameFrom, current)
    total_path := [current]
    while current in cameFrom.Keys:
        current := cameFrom[current]
        total_path.append(current)
    return total_path
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
