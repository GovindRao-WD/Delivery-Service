import fs from "fs";

class TownGraph {
  constructor() {
    this.adjacency = {};
  }

  addRoutes = (source, destination, cost) => {
    let destinationObject = {
      destination,
      cost,
    };
    if (this.adjacency[source]) {
      this.adjacency[source] = [...this.adjacency[source], destinationObject];
    } else {
      this.adjacency[source] = [destinationObject];
    }
  };

  createTownGraph = (routesString) => {
    let routes = routesString.split(",");
    routes = routes.map((each) => each.trim());
    routes.map((each) => {
      let destinationArray = each.substring(0, 2).split("");
      let source = destinationArray[0];
      let destination = destinationArray[1];
      let cost = parseInt(each.substring(2));
      if (source && destination && cost) {
        this.addRoutes(source, destination, cost);
      }
    });
  };

  isPathAvailable = (source, destination, stops = []) => {
    if (this.adjacency[source]) {
      let routeCost = 0;

      if (stops.length) {
        let townStack = [source, ...stops, destination];
        townStack.reverse();
        while (townStack.length !== 0) {
          let town = townStack.pop();
          let destinationsForTown = this.adjacency[town];
          if (
            !destinationsForTown ||
            destinationsForTown.length === 0 ||
            town === destination
          ) {
            break;
          } else {
            let stopAvailable = false;
            let nextStop = townStack.pop();
            destinationsForTown.forEach((each) => {
              if (each.destination === nextStop) {
                stopAvailable = true;
                routeCost += each.cost;
              }
            });
            townStack.push(nextStop);
            if (!stopAvailable) {
              break;
            }
          }
        }
      } else {
        let destinationsForTown = this.adjacency[source];
        destinationsForTown.forEach((each) => {
          if (each.destination === destination) {
            routeCost = each.cost;
          }
        });
      }
      if (routeCost > 0) {
        return routeCost;
      } else {
        return "No Such Route";
      }
    } else {
      return "No Such Route";
    }
  };

  numberOfRoutes = (source, destination, visited, routeListObj) => {
    if (source === destination) {
      routeListObj[Object.keys(routeListObj).length] = `Route ${
        Object.keys(routeListObj).length + 1
      }`;
      return;
    }
    visited[source] = true;

    let destinationsForTown = this.adjacency[source];

    destinationsForTown.forEach((each) => {
      if (!visited[each.destination]) {
        this.numberOfRoutes(
          each.destination,
          destination,
          visited,
          routeListObj
        );
      }
    });
    visited[source] = false;
  };
}

export default TownGraph;
