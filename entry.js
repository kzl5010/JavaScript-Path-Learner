import { astar } from './algo';
import Graph from './graph';
import { bfs } from './bfs';

let WALL = 0,
    performance = window.performance;

$(function() {

    let $grid = $("#search_grid"),
        $WallFreq = $("#WallFreq"),
        $GridSize = $("#GridSize"),
        $showAll = $("#showAll"),
        $nextNode = $("#nextNode");

    let options = {
        WallFreq: $WallFreq.val(),
        gridSize: $GridSize.val(),
        showAll: $showAll.is("checked"),
        closest: $nextNode.is("checked")
    };

    let grid = new GraphSolver($grid, options, bfs.search);

    $("#generateGrid").click(function() {
        grid.initialize();
    });

    $WallFreq.change(function() {
        grid.setOption({WallFreq: $(this).val()});
        grid.initialize();
    });

    $GridSize.change(function() {
        grid.setOption({gridSize: $(this).val()});
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

let css = { start: "start", finish: "finish", wall: "wall", active: "active" };

class GraphSolver {
  constructor($graph, options, implementation) {
    this.$graph = $graph;
    this.search = implementation;
    this.options = $.extend({WallFreq:0.1, showAll:true, gridSize:10}, options);
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

      let cellWidth = ($graph.width()/this.options.gridSize)-2; // -2 for border
      let cellHeight = ($graph.height()/this.options.gridSize)-2;
      let $cellTemplate = $("<span />").addClass("grid_item").width(cellWidth).height(cellHeight);
      this.startSet = false;

      for(let x = 0; x < this.options.gridSize; x++) {
          let $row = $("<div class='clear' />"),
              nodeRow = [],
              gridRow = [];

          for(let y = 0; y < this.options.gridSize; y++) {
              let id = "cell_"+x+"_"+y,
                  $cell = $cellTemplate.clone();
              $cell.attr("id", id).attr("x", x).attr("y", y);
              $row.append($cell);
              gridRow.push($cell);

              let isWall = Math.floor(Math.random()*(1/that.options.WallFreq));
              if(isWall === 0) {
                  nodeRow.push(WALL);
                  $cell.addClass(css.wall);
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

      this.graph = new Graph(nodes);

      // bind cell event, set start/wall positions
      this.$cells = $graph.find(".grid_item");
      this.$cells.click(function() {
          that.chosenNode($(this));
      });
  };
  chosenNode($end) {
    let end = this.nodeFromElement($end);

    if($end.hasClass(css.wall) || $end.hasClass(css.start)) {
        return;
    }
    if (!this.startSet ) {
      $end.addClass(css.start);
      this.startSet = true;
      return;
    }

    this.$cells.removeClass(css.finish);
    $end.addClass(css.finish);
    let $start = this.$cells.filter("." + css.start),
        start = this.nodeFromElement($start);

    let sTime = performance ? performance.now() : new Date().getTime();

    let path = this.search(this.graph, start, end, {
        closest: this.options.closest
    });
    let fTime = performance ? performance.now() : new Date().getTime(),
        duration = (fTime-sTime).toFixed(2);

    if(path.length === 0) {
        $("#message").text("No solution (" + duration + "ms)");
        this.noSolution();
    }
    else {
        $("#message").text("search took " + duration + "ms.");
        this.showAllVisited();
        this.animatePath(path);
    }
  };
  showAllVisited() {
      this.$cells.html(" ");
      let that = this;
      if(this.options.showAll) {
          that.$cells.each(function() {
              let node = that.nodeFromElement($(this)),
                  showAll = false;
              if (node.visited) {
                  showAll = true;
              }

              if (showAll) {
                  $(this).html("visited");
                  $(this).addClass("visited");
              }
          });
      }
  };
  nodeFromElement($cell) {
    if ($cell.length === 0) {
      return;
    }
    return this.graph.grid[parseInt($cell.attr("x"))][parseInt($cell.attr("y"))];

  };
  noSolution() {
      let $graph = this.$graph;
      this.$cells.removeClass(css.start);
      this.$cells.removeClass(css.finish);
      this.startSet = false;
  };
  animatePath(path) {
      let grid = this.grid,
          timeout = 1000 / grid.length,
          elementFromNode = function(node) {
          return grid[node.x][node.y];
      };

      let that = this;
      // will add start class if final
      let removeClass = function(path, i) {
          if(i >= path.length) { // finished removing path, set start positions
              return setStartClass(path, i);
          }
          elementFromNode(path[i]).removeClass(css.active);
          setTimeout(function() {
              removeClass(path, i+1);
          }, timeout*path[i].getCost());
      };
      let setStartClass = function(path, i) {
          if(i === path.length) {
              that.$graph.find("." + css.start).removeClass(css.start);
              // elementFromNode(path[i-1]).addClass(css.start);
              that.startSet = false;
          }
      };
      let addClass = function(path, i) {
          if(i >= path.length) { // Finished showing path, now remove
              return removeClass(path, 0);
          }
          elementFromNode(path[i]).addClass(css.active);
          setTimeout(function() {
              addClass(path, i+1);
          }, timeout*path[i].getCost());
      };

      addClass(path, 0);
      this.$graph.find("." + css.start).removeClass(css.start);
      this.$graph.find("." + css.finish).removeClass(css.finish);
  };
}
