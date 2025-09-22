package main

import (
	"fmt"
	"math/rand/v2"
	"sort"
)

func main() {
	fmt.Println("Starting dropSync")
	fmt.Println(dropSyms(10, 10, []rune{1, 2, 3, 4},Options{maxClusterSize: 5, errorsAllowed: 10, failSilently: true} ));
}
type Vector2Int struct{
	x int;
	y int;
}
type Cluster struct {
  clusterID int;
  members []Vector2Int;
  neighbors []int;
  open []Vector2Int;
  symbol rune;
  nudgingNeighbor int;
  sortedID int;
}
type Options struct {
  maxClusterSize int;
  errorsAllowed int; // Determines how hard the algorithm will try before it gives up
  failSilently bool; // If it gives up, should it return null, or fill the missing pieces with random tiles?
};

func dropSyms(rows, cols int, syms []rune, opt Options) [][]rune {
  var returnValue = [][]rune{};
  var clusterMap = [][]int{};
  var remainingTiles = []Vector2Int{};
  var clusters = []Cluster{};
  // Populate data structures
  for x := 0; x < rows; x++ {
    returnValue = append(returnValue, []rune{});
    clusterMap = append(clusterMap, []int{});
    for y := 0; y < cols; y++ {
      remainingTiles = append(remainingTiles, Vector2Int{x:x, y:y});
      clusterMap[x] = append(clusterMap[x], -1);
      returnValue[x] = append(returnValue[x], -1);

    }
  }
  for len(remainingTiles) > 0 {
    // Pick a random unpainted spot
	var randomTileIndex = rand.IntN(len(remainingTiles))
    var randomTile = remainingTiles[randomTileIndex];
    remainingTiles = append(remainingTiles[:randomTileIndex], remainingTiles[randomTileIndex+1:]...);
    var xPos = randomTile.x;
    var yPos = randomTile.y;

    // Set up a cluster
    var cluster Cluster;
    cluster.clusterID = len(clusters);
	cluster.open = append(cluster.open, Vector2Int{x:xPos, y:yPos});
    //Start growing the cluster
    for (len(cluster.open) > 0 && len( cluster.members) < opt.maxClusterSize)  {
      var index = rand.IntN(len(cluster.open));
      var current = cluster.open[index];
      cluster.open = append(cluster.open[:index], cluster.open[index+1:]...); // Delete entry at index
      clusterMap[current.x][current.y] = cluster.clusterID;
	  cluster.members = append(cluster.members, current);
	  removeRemainingTiles(remainingTiles, current);

      var neighbors = getneighbors(clusterMap, current);
	  for _, neighbor := range neighbors {
        if (clusterMap[neighbor.x][neighbor.y] == -1) {
			cluster.open = append(cluster.open, Vector2Int{x:neighbor.x, y:neighbor.y});
        }
      }
    }

    //Find neighboring clusters
	for _, tile := range cluster.members {
		var neighboringClusters = getneighbors(clusterMap, tile);
		for _, neighbor := range neighboringClusters {
			var neighborID = clusterMap[neighbor.x][neighbor.y]
			if (neighborID != -1 && neighborID != cluster.clusterID) {
				cluster.neighbors = append(cluster.neighbors, neighborID);
				clusters[neighborID].neighbors = append(clusters[neighborID].neighbors, cluster.clusterID);
			}
		}
    }
    cluster.symbol = -1;
	clusters = append(clusters, cluster);
  }
  // Sort clusters
  var sortedClusters []Cluster;
  copy(sortedClusters, clusters);
  sort.Slice(sortedClusters, func(i, j int) bool {
	return len(sortedClusters[j].neighbors) < len(sortedClusters[i].neighbors)
  })
  for i := 0; i < len(sortedClusters); i++ {
    sortedClusters[i].sortedID = i;
  }

  // Paint clusters
  var majorErrors = 0;
  for clusterItt := 0; clusterItt < len(sortedClusters); clusterItt++ {
    var cluster = sortedClusters[clusterItt];
    // Use a Four color theorem algorithm to ensure no neighboring clusters share color
    // TODO: Make this time deterministic! Don't randomly shuffle colors untill it works, but instead shuffle them intelligently.
    var foundValid = false;
    cluster.symbol = -1;
    var randomStartColor = rand.IntN(len(syms));
    for symbolItt := 0; symbolItt < len(syms); symbolItt++ {
      var newSymbol = rune((randomStartColor + symbolItt) % len(syms));
      var isValid = true;
	  for _, neighbor := range cluster.neighbors {
        if (clusters[neighbor].symbol == newSymbol) {
          isValid = false;
        }
      }
      if (isValid) {
        foundValid = true;
        cluster.symbol = newSymbol;
        break;
      }
    }
    if (!foundValid) {
      cluster.nudgingNeighbor++;
      if (cluster.nudgingNeighbor >= len(cluster.neighbors)) {
        majorErrors++;
        if (majorErrors > opt.errorsAllowed) {
			    fmt.Println("dropSyms failed to find a valid configuration!");
          if (opt.failSilently) {
            break;
          } else {
            return nil;
          }
        }
      }
      var targetCluster = cluster.neighbors[cluster.nudgingNeighbor % len(cluster.neighbors)];
      clusters[targetCluster].symbol = -1;
      clusterItt = min( clusters[targetCluster].sortedID, sortedClusters[clusterItt].sortedID ) - 1;
    }
  }
  // Paint tiles
  for _, cluster := range clusters {
  	for _, tile := range cluster.members {
      if (cluster.symbol != -1) {
        returnValue[tile.x][tile.y] = syms[cluster.symbol];
      } else {
        returnValue[tile.x][tile.y] = syms[rand.IntN(len(syms))];
      }
    };
  };
  return returnValue;
}

func removeRemainingTiles(remainingTiles []Vector2Int, removedTile Vector2Int){
	//TODO: Since we know how remainingTiles are ordered, we could optimize this function quite a bit.
	for i, checkTile := range remainingTiles {
		if checkTile.x == removedTile.x && checkTile.y == removedTile.y {
    		remainingTiles = append(remainingTiles[:i], remainingTiles[i+1:]...);
			return;
		}
	}
}

func getneighbors(board [][]int, pos Vector2Int) []Vector2Int {
  var returnValue []Vector2Int;
  if (pos.x > 0) {
	returnValue = append(returnValue, Vector2Int{x:pos.x - 1, y:pos.y});
  }
  if (pos.y > 0) {
	returnValue = append(returnValue, Vector2Int{x:pos.x, y:pos.y - 1});
  }
  if (pos.x < len(board) - 1) {
	returnValue = append(returnValue, Vector2Int{x:pos.x + 1, y:pos.y});
  }
  if (pos.y < len(board[0]) - 1) {
	returnValue = append(returnValue, Vector2Int{x:pos.x, y:pos.y + 1});
  }
  return returnValue;
}