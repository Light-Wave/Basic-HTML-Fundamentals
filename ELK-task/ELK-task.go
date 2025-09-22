package main

import "fmt"

func main() {
	fmt.Println("Hello, 世界")
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
  var returnValue [][]rune;
  var clusterMap [][]int;
  var remainingTiles []Vector2Int;
  //var clusters []Cluster;

  // Populate data structures
  for x := 0; x < rows; x++ {
    //returnValue[x] = []rune;
    //clusterMap[x] = []int;
    for y := 0; y < cols; y++ {
      remainingTiles = append(remainingTiles, Vector2Int{x:x, y:y});
      clusterMap[x][y] = -1;
    }
  }
  /*
  while (remainingTiles.size > 0) {
    // Pick a random unpainted spot
    item =
      Array.from(remainingTiles)[
        Math.floor(Math.random() * remainingTiles.size)
      ];
    remainingTiles.delete(item);
    let components = item.split(":");
    let xPos = parseInt(components[0]);
    let yPos = parseInt(components[1]);

    // Set up a cluster
    const cluster = new Cluster();
    cluster.clusterID = clusters.length;
    cluster.open.push({ x: xPos, y: yPos });

    //Start growing the cluster
    while (
      cluster.open.length > 0 &&
      cluster.members.length < opt.maxClusterSize
    ) {
      const index = Math.floor(Math.random() * cluster.open.length); //Got help from chatGPT
      const current = cluster.open.splice(index, 1)[0]; // Got help from chatGPT
      clusterMap[current.x][current.y] = cluster.clusterID;
      cluster.members.push(current);
      remainingTiles.delete(current.x + ":" + current.y);

      const neighbors = getneighbors(clusterMap, current.x, current.y);
      neighbors.forEach((neighbor) => {
        if (neighbor.tile == -1) {
          cluster.open.push({ x: neighbor.x, y: neighbor.y });
        }
      });
    }

    //Find neighboring clusters
    cluster.members.forEach((tile) => {
      getneighbors(clusterMap, tile.x, tile.y).forEach((neighbor) => {
        if (neighbor.tile != -1 && neighbor.tile != cluster.clusterID) {
          cluster.neighbors.add(neighbor.tile);
          clusters[neighbor.tile].neighbors.add(cluster.clusterID);
        }
      });
    });

    clusters.push(cluster);
  }

  // Sort clusters
  let sortedClusters = clusters.toSorted((a, b) => {
    return b.neighbors.size - a.neighbors.size;
  });
  for (let i = 0; i < sortedClusters.length; i++) {
    sortedClusters[i].sortedID = i;
  }

  // Paint clusters
  let majorErrors = 0;
  for (let clusterItt = 0; clusterItt < sortedClusters.length; clusterItt++) {
    const cluster = sortedClusters[clusterItt];
    // Use a Four color theorem algorithm to ensure no neighboring clusters share color
    // TODO: Make this time deterministic! Don't randomly shuffle colors untill it works, but instead shuffle them intelligently.
    let foundValid = false;
    cluster.symbol = null;
    let randomStartColor = Math.floor(Math.random() * syms.length);
    for (let symbolItt = 0; symbolItt < syms.length; symbolItt++) {
      let newSymbol = (randomStartColor + symbolItt) % syms.length;
      let isValid = true;
      cluster.neighbors.forEach((neighbor) => {
        if (clusters[neighbor].symbol == newSymbol) {
          isValid = false;
        }
      });
      if (isValid) {
        foundValid = true;
        cluster.symbol = newSymbol;
        break;
      }
    }
    if (!foundValid) {
      cluster.nudgingNeighbor++;
      if (cluster.nudgingNeighbor >= cluster.neighbors.size) {
        //console.log(
        //  "Could not find valid color for " +
        //    sortedClusters[clusterItt].clusterID
        //);
        cluster.nudgingColors++;
        majorErrors++;
        if (majorErrors > opt.errorsAllowed) {
          console.log("dropSyms failed to find a valid configuration!");
          if (opt.failSilently) {
            break;
          } else {
            return null;
          }
        }
      }
      let targetCluster = Array.from(cluster.neighbors)[
        cluster.nudgingNeighbor % cluster.neighbors.size
      ];
      //console.log(
      //  "Trying to nudge " +
      //    targetCluster +
      //    " due to " +
      //    sortedClusters[clusterItt].clusterID
      //);
      clusters[targetCluster].symbol = null;
      clusterItt =
        [
          Math.min(
            clusters[targetCluster].sortedID,
            sortedClusters[clusterItt].sortedID
          ),
        ] - 1;
    }
  }
  // Paint tiles
  clusters.forEach((cluster) => {
    cluster.members.forEach((tile) => {
      if (cluster.symbol != undefined) {
        returnValue[tile.x][tile.y] = syms[cluster.symbol];
      } else {
        returnValue[tile.x][tile.y] =
          syms[Math.floor(Math.random() * syms.length)];
      }
    });
  });

  debugMap = clusterMap;*/
  return returnValue;
}
