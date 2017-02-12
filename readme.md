# JavaScript Path Learner

[JavaScript Path Learner](https://js-maze-solver.herokuapp.com/) is a JavaScript project designed to help learn algorithms. It is created with JavaScript, jQuery, HTML5, and styled with CSS3.

<!-- ![Home page](Images) -->

## Features
- [x] Generate mazes and choose size
- [x] Set start and end points
- [x] Choose algorithm to visualize
- [x] Instructions
- [x] Specify weighted vs. unweighted

## Design
This visualizer features a tailored random grid. To run an algorithm the user chooses start and end points after specifying the details of the grid.

<!-- ![AStar homepage](Images) -->

The top of the screen contains instructions. There are user controlled options for algorithm to run, grid size, obstacle density, and grid weight. The visualizer displays the path from the start node to the end node with the option to view all the visited tiles after the search. The path is the shortest path calculated using the algorithm chosen.

The visualizer supports different grid sizes based on user preference. The **Generate Maze** button allows the user to generate randomized mazes as desired.

<!-- ![BFS](Image) -->

To prevent the algorithm from drawing everything at once, timeouts and callbacks were used to synchronously highlight the route. 
<!--


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

The site supports two algorithms: Breadth-first search and A* search. These are implemented as path-finding algorithms moving in an North, East, South, West pattern with more coming in the future (diagonal support may be available in the future, but is not a priority).  


### A* Search

The A* algorithm was implemented with arrays acting as the open and closed sets. Graph nodes were stored in a class and a binary heap was used to determine the lowest cost path from the start to the endpoint. The function was almost identical to the pseudocode available from Wikipedia: 

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

### Breadth-first Search

BFS here was implemented with an array as a queue. Nodes were pushed into a "set" that tracked all of the visited elements and the search worked by adding neighbors of the most recent node popped from the queue until the queue was empty. Again the code was adapted from Wikipedia's pseudocode:

```javascript 
Breadth-First-Search(Graph, root):
    
    create empty set S
    create empty queue Q      

    root.parent = NIL
    Q.enqueue(root)                      

    while Q is not empty:
        current = Q.dequeue()
        if current is the goal
            return current
        for each node n that is adjacent to current:
            if n is not in S:
                add n to S
                n.parent = current
                Q.enqueue(n)
```    


## Future

Here are some features that I would like to implement in the future:
- [ ] Bugfix: User clicking while the algorithm is still running disrupts things.
- [ ] The path draws all the nodes as it visits them instead of after
- [ ] More algorithms Kruskal's, Dijkstra's, and Prim's
- [ ] User drawable mazes
- [ ] Different heuristics and allowing diagonals
- [ ] More direct algorithmic comparisons, like running two at the same time using different colors
