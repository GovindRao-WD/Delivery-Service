import fs from "fs";
import TownGraph from "./TownGraph";

const townGraph = new TownGraph();
let routesString = "";

beforeEach(async () => {
  routesString = await fs.promises.readFile("routes.text", "utf8");
});

test("Getting the routes", () => {
  fs.readFile("routes.text", "utf8", (err, data) => {
    expect(routesString).toBe(
      "AB1, AC4, AD10, BE3, CD4, CF2, DE1, EB3, EA2, FD1"
    );
  });
});

test("Getting number of distinct Routes", () => {
  let routes = routesString.split(",");
  routes = routes.map((each) => each.trim());
  expect(routes.length).toBe(10);
});

test("Creating Town Graph, Number of Towns should be 6", () => {
  const townGraph = new TownGraph();
  townGraph.createTownGraph(routesString);
  expect(Object.keys(townGraph.adjacency).length).toBe(6);
});

describe("Checking cost for routes", () => {
  test("The delivery cost of route A-B-E should be 4", () => {
    const townGraph = new TownGraph();
    townGraph.createTownGraph(routesString);
    expect(townGraph.isPathAvailable("A", "E", ["B"])).toBe(4);
  });
  test("The delivery cost of route A-D should be 10", () => {
    const townGraph = new TownGraph();
    townGraph.createTownGraph(routesString);
    expect(townGraph.isPathAvailable("A", "D")).toBe(10);
  });
  test("The delivery cost of route E-A-C-F should be 8", () => {
    const townGraph = new TownGraph();
    townGraph.createTownGraph(routesString);
    expect(townGraph.isPathAvailable("E", "F", ["A", "C"])).toBe(8);
  });
  test("The delivery cost of route A-D-F should be Nothing, and No Such Route should be returned", () => {
    const townGraph = new TownGraph();
    townGraph.createTownGraph(routesString);
    expect(townGraph.isPathAvailable("A", "D", ["F"])).toBe("No Such Route");
  });
});

describe("calculating possible routes", () => {
  test("The number of possible delivery routes from E to D with a maximum of 4 stop without using the same route twice in a delivery route", () => {
    const townGraph = new TownGraph();
    townGraph.createTownGraph(routesString);
    let routeListObject = {};
    townGraph.numberOfRoutes("E", "D", {}, routeListObject);
    expect(Object.keys(routeListObject).length).toBe(3);
  });

  test("The number of possible delivery routes from E to E without using the same route twice in the delivery route", () => {
    const townGraph = new TownGraph();
    townGraph.createTownGraph(routesString);
    let routeListObject = {};
    townGraph.numberOfRoutes("E", "E", {}, routeListObject);
    expect(Object.keys(routeListObject).length).toBe(5);
  });
});
