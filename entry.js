import { astar } from './lib/algo';
import Graph from './lib/graph';
import { bfs } from './lib/bfs';
import { dfs } from './lib/dfs';

let WALL = 0;
let performance = window.performance;

let searches = {
  astar: astar,
  bfs: bfs,
  dfs: dfs
};

let astar_desc = "A* (star) is a search algorithm that is very popular in pathfinding and graph traversal because of its fast performance and accuracy. It works as a best-first search, solving the path by selecting the lowest cost option among possible paths (constructing a tree of paths one step at a time until a path reaches the endpoint).";

let bfs_desc = "Breadth-First-Search works by expanding outward in all four directions one step at a time from each node in order of its insertion into a Queue that contains all of the upcoming search targets, continuing until it finds the endpoint. The primary strength of BFS is the simplicity of implementation.";

let dfs_desc = "Depth-First Search works by going as far as possible in one specific direction and upon encountering an obstacle or the edge of the maze and it continues again until the endpoint is found or all available tiles have been searched. This algorithm has been sped up by searching three tiles at a time. "
let descriptions = {
  astar: astar_desc,
  bfs: bfs_desc,
  dfs: dfs_desc
};

$(function() {
    let $algoType = $("#algoType");
    let $grid = $("#search_grid");
    let $WallFreq = $("#WallFreq");
    let $graphSize = $("#graphSize");
    let $showAll = $("#showAll");
    let $nextNode = $("#nextNode");
    let algoType = $algoType.val();
    let $description = $("#description");
    $description.html(descriptions[algoType]);
    let options = {
        WallFreq: $WallFreq.val(),
        graphSize: $graphSize.val(),
        showAll: $showAll.is("checked"),
        closest: $nextNode.is("checked")
    };


    let grid = new GraphSolver($grid, options, searches[algoType].search, searches[algoType]);

    $("#generateGrid").click(function() {
        grid.initialize();
    });

    $algoType.change(function(){
      let newOptions = {
          WallFreq: $WallFreq.val(),
          graphSize: $graphSize.val(),
          showAll: $showAll.is("checked"),
          closest: $nextNode.is("checked")
      };
      grid = new GraphSolver($grid, newOptions, searches[$(this).val()].search, searches[$(this).val()]);
      grid.initialize();
      $showAll.prop("checked", false);
      $nextNode.prop("checked", false);
      // $WallFreq.val(".0");
      $description.html(descriptions[$(this).val()]);
    });

    $WallFreq.change(function() {
        grid.setOption({WallFreq: $(this).val()});
        grid.initialize();
    });

    $graphSize.change(function() {
        grid.setOption({graphSize: $(this).val()});
        grid.initialize();
    });

    $showAll.change(function() {
        grid.setOption({showAll: $(this).is(":checked")});
    });

    $nextNode.change(function() {
        grid.setOption({closest: $(this).is(":checked")});
    });

    $("#weighted").click( function () {
        if ($("#weighted").prop("checked")) {
            $('#weightsKey').slideDown();
        } else {
            $('#weightsKey').slideUp();
        }
    });

});

let css = { first: "first", end: "end", brick: "brick", path: "path", route: "route" };

class GraphSolver {
  constructor($graph, options, implementation, algo) {
    this.algo = algo;
    this.$graph = $graph;
    this.search = implementation;
    this.options = $.extend({WallFreq:0.1, showAll:true, graphSize:10}, options);
    this.initialize();
  }
  setOption(option) {
    this.options = $.extend(this.options, option);
    this.showAllVisited();
  };
  initialize() {
      this.grid = [];
      let that = this;
      let nodes = [];
      let $graph = this.$graph;

      $graph.empty();

      let unitWidth = ($graph.width()/this.options.graphSize)-2;
      let unitHeight = ($graph.height()/this.options.graphSize)-2;
      let $cellTemplate = $("<span />").addClass("grid_item").width(unitWidth).height(unitHeight);
      this.startSet = false;

      for(let x = 0; x < this.options.graphSize; x++) {
          let $row = $("<div class='row' />"),
              nodeRow = [],
              gridRow = [];

          for(let y = 0; y < this.options.graphSize; y++) {
              let id = "cell_"+x+"_"+y,
                  $cell = $cellTemplate.clone();
              $cell.attr("id", id).attr("x", x).attr("y", y);
              $row.append($cell);
              gridRow.push($cell);

              let isWall = Math.floor(Math.random()*(1/that.options.WallFreq));
              if(isWall === 0) {
                  nodeRow.push(WALL);
                  $cell.addClass(css.brick);
              }
              else  {
                  let cell_cost = ($("#weighted").prop("checked") ? (Math.floor(Math.random() * 3)) * 5 + 1 : 1);
                  nodeRow.push(cell_cost);
                  $cell.addClass('weight' + cell_cost);
                  if ($("#displayWeights").prop("checked")) {
                      $cell.html(cell_cost);
                  }
                  // if (!startSet) {
                  //     $cell.addClass(css.start);
                  //     startSet = true;
                  // }
              }
          }
          $graph.append($row);

          this.grid.push(gridRow);
          nodes.push(nodeRow);
      }

      this.graph = new Graph(nodes, this.algo);

      this.$cells = $graph.find(".grid_item");
      this.$cells.click(function() {
          that.chosenNode($(this));
      });
  };
  chosenNode($end) {
    // this.graph.clearNodes();
    $end.removeClass("visited")
    let end = this.findNode($end);

    if($end.hasClass(css.brick) || $end.hasClass(css.first)) {
        return;
    }
    if (!this.startSet ) {
      $end.addClass(css.first);
      this.startSet = true;
      return;
    }

    this.$cells.removeClass(css.end);
    this.$cells.removeClass(css.route);
    this.$cells.removeClass("visited");
    this.$cells.removeClass(css.path);
    $end.addClass(css.end);
    let $first = this.$cells.filter("." + css.first),
        first = this.findNode($first);

    let sTime = performance ? performance.now() : new Date().getTime();

    let path = this.search(this.graph, first, end, {
        closest: this.options.closest
    });
    let fTime = performance ? performance.now() : new Date().getTime(),
        duration = (fTime-sTime).toFixed(2);

    if(path.length === 0) {
        $("#message").text("No solution (" + duration + "ms)");
        this.noSolution();
    }
    else {
        $("#message").text("Search took " + duration + "ms.");
        // this.traceRoute(path);
        this.path = path;
        this.traceRoute(this.graph.visitedNodes);
        this.showAllVisited();

    }
  };
  showAllVisited() {
      this.$cells.html(" ");
      let that = this;
      if(this.options.showAll) {
          that.$cells.each(function() {
              let node = that.findNode($(this)),
                  showAll = false;
              if (node.visited) {
                  showAll = true;
              }

              if (showAll) {
                  // $(this).html("visited");
                  $(this).addClass("visited");
              }
          });
      }
  };
  findNode($cell) {
    if ($cell.length === 0) {
      return;
    }
    return this.graph.grid[parseInt($cell.attr("x"))][parseInt($cell.attr("y"))];

  };
  noSolution() {
      let $graph = this.$graph;
      this.$cells.removeClass(css.first);
      this.$cells.removeClass(css.end);
      this.startSet = false;
  };
  traceRoute(path) {
      let grid = this.grid,
          timeout = 18,
          // timeout = 1000 / grid.length,
          elementFromNode = function(node) {
          return grid[node.x][node.y];
      };

      let that = this;
      let removeClass = function(path, i) {
          if(i >= path.length) {
              return setStartClass(path, i);
          }
          // elementFromNode(path[i]).removeClass(css.path);
          setTimeout(function() {
              removeClass(path, i+1);
          }, timeout*path[i].getCost());
      };
      let setStartClass = function(path, i) {
          if(i === path.length) {
              that.$graph.find("." + css.first).removeClass(css.first);
              // elementFromNode(path[i-1]).addClass(css.first);
              that.startSet = false;
          }
      };
      let addClass = function(path, i) {
          if(i >= path.length) {
              addClass2(that.path, 0)
              return removeClass(path, 0);
          }
          elementFromNode(path[i]).addClass(css.path);
          setTimeout(function() {
              addClass(path, i+1);
          }, timeout);
          // Insert this above where timeout is if needed timeout*path[i].getCost()

      };

      let addClass2 = function(path, i) {
          if(i >= path.length) {
              return removeClass(path, 0);
          }
          elementFromNode(path[i]).removeClass(css.path);
          elementFromNode(path[i]).addClass(css.route);
          setTimeout(function() {
              addClass2(path, i+1);
          }, timeout);
          // Insert this above where timeout is if needed timeout*path[i].getCost()
      };

      addClass(path, 0);
      this.$graph.find("." + css.first).removeClass(css.first);
      this.$graph.find("." + css.end).removeClass(css.end);
  };
}
