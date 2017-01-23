## JS Project Proposal: Algorithm Visualizer

### Background

Algorithms Visualization is as the name describes. I will be using some basic sorting algorithms like heap, bubble, merge, quick (randomized), radix, and bucket. There will be maze solving algorithms like A BFS, DFS, Primm's, Kruskal's, and Dijkstra's. Depending on how long these take there may or may not be more algorithms.

There should be some variations of certain algorithms included in the above list. The **Functionality & MVP** and **Bonus Features** sections outline the project and future updates.  

### Functionality & MVP  

With this Algorithm Visualizer, users will be able to:

- [ ] Start and pause sorting and graph algorithms 
- [ ] Choose from preset initial states and randomized data.
- [ ] Compare the runtime between two algorithms that deal with the same input/problem 

In addition, this project will include:

- [ ] A description modal describing the current algorithm(s)
- [ ] A production Readme

### Wireframes

This app will consist of a single screen with one or two grids/mazes, and nav links to the Github, LinkedIn,
and the Description modal.  The controls will include Start and Stop buttons as well as options to change the starting data.  On the left, four clickable options will be used to toggle between starting data, type of algorithm, single or double algorithm, and algorithm(s) to run.  

![wireframes](./"js wirefram.png")

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jquery` for overall structure and logic,
- `Easel.js` with `HTML5 Canvas` for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

In addition to the webpack entry file, there will be four scripts involved in this project:

`grid.js`: this script will handle the logic for creating and updating the necessary `Easel.js` elements and rendering them to the DOM.

`algorithm.js`: this script will handle the logic behind the scenes.  An Algorithm object will hold a `name` (of the algorithm) and access two scripts (sort or graph) to execute an algorithm.  It will be responsible for executing a given algorithm.

`sort.js`: this script will house the logic and functions for all the sorting algorithms.

`graph.js`: this script will hour the logic and functions for all the graph algorithms. 

### Implementation Timeline

**Day 1**: Install all necessary Node modules, including getting webpack and `Easel.js` running.  Make `webpack.config.js` and `package.json`.  Create basic entry file and the bare bones of all 4 scripts outlined above.  Learn the basics of `Easel.js`.  Goals for the day:

- Get a green bundle with `webpack`
- Learn enough `Easel.js` to render an object to the `Canvas` element

**Day 2**: Dedicate this day to learning the `Easel.js` API.  First, build out the `sort` and `graph ` objects to connect to the `algorithm` object.  Then, use `grid.js` to create and render an array or maze/graph depending on the algorithm. Goals for the day:

- Complete the `sort.js` module (constructor, update functions)
- Render an array or maze to the `Canvas` using `Easel.js`
- Set up preset states for the grid

**Day 3**: Create the algorithm logic backend.  Build out modular functions for handling the different data types Incorporate the algorithm logic into the `grid.js` rendering.  Goals for the day:

- Export an `algorithm` object with correct type and name handling logic
- Have a functional visualization on the `Canvas` frontend that correctly handles the types of algorith ms and data. 


**Day 4**: Complete the graph algorithms for the user to interact with the game.  Style the frontend. Goals for the day:

- Finish `graph.js` module
- Have a styled `Canvas`, nice looking controls and title


### Bonus features

Some possible updates are:

- [ ] Add their own data to test the algorithms
- [ ] Add multiple choices for starting states that are interesting
