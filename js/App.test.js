const fs = require("fs");

test("Getting the routes", async () => {
  fs.readFile("routes.text", "utf8", (err, data) => {
    expect(data).toBe("AB1, AC4, AD10, BE3, CD4, CF2, DE1, EB3, EA2, FD1");
  });
});

test("Getting number of Routes", async () => {
  fs.readFile("routes.text", "utf8", (err, data) => {
    const routesString = data;
    let routes = data.split(",");
    routes = routes.map((each) => each.trim());
    expect(routes.length).toBe(10);
  });
});
