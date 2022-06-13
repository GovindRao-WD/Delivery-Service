import React, { useEffect, useState } from "react";
import TownGraph from "./TownGraph";

const TOWN_NAMES = {
  A: "Town A",
  B: "Town B",
  C: "Town C",
  D: "Town D",
  E: "Town E",
  F: "Town F",
};

export default (props) => {
  const [townsRoutes, setTownsRoutes] = useState("");
  const [sourceTowns, setSourceTowns] = useState([]);
  const [sourceTown, setSourceTown] = useState("");
  const [destinationTowns, setDestinationTowns] = useState([]);
  const [destinationTown, setDestinationTown] = useState("");
  const [stoppageTowns, setStoppageTowns] = useState([]);
  const [stoppageTownList, setStoppageTownList] = useState([]);
  const [cost, setCost] = useState("");
  const [routeCount, setRouteCount] = useState("");

  useEffect(async () => {
    const response = await fetch("routes.text");
    const townsFromResponse = await response.text();
    setTownsRoutes(townsFromResponse);
    const townGraph = new TownGraph();
    townGraph.createTownGraph(townsFromResponse);
    createSourceTownList(Object.keys(townGraph.adjacency));
  }, []);

  const createSourceTownList = (towns) => {
    setSourceTowns(prepareTownList(towns));
  };

  const prepareTownList = (towns) => {
    let sourceTowns = [];
    console.log(towns);
    towns.map((each) => {
      let sourceTown = {};
      sourceTown["name"] = TOWN_NAMES[each];
      sourceTown["id"] = each;
      sourceTowns.push(sourceTown);
    });
    return sourceTowns;
  };

  const selectSourceTown = (value) => {
    setSourceTown(value);
    const townGraph = new TownGraph();
    townGraph.createTownGraph(townsRoutes);
    let townList = prepareTownList(Object.keys(townGraph.adjacency));
    townList = townList.filter((each) => each.id !== value);
    setDestinationTowns(townList);
  };

  const selectDestinationTown = (value) => {
    setDestinationTown(value);
    const townGraph = new TownGraph();
    townGraph.createTownGraph(townsRoutes);
    let townList = prepareTownList(Object.keys(townGraph.adjacency));
    townList = townList.filter(
      (each) => each.id !== value && each.id !== sourceTown
    );
    setStoppageTownList(townList);
  };

  const selectStoppage = (value) => {
    setStoppageTowns([...stoppageTowns, value]);
    let stoppageTownListFromState = [...stoppageTownList];
    stoppageTownListFromState = stoppageTownListFromState.filter(
      (each) => each.id !== value
    );
    setStoppageTownList(stoppageTownListFromState);
  };

  const reset = (e) => {
    e.preventDefault();
    setSourceTown("");
    setDestinationTown("");
    setStoppageTowns([]);
    setStoppageTownList([]);
    setDestinationTowns([]);
    setCost("");
    setRouteCount("");
    const townGraph = new TownGraph();
    townGraph.createTownGraph(townsRoutes);
    createSourceTownList(Object.keys(townGraph.adjacency));
  };

  const calculateCost = (e) => {
    e.preventDefault();
    const townGraph = new TownGraph();
    townGraph.createTownGraph(townsRoutes);
    let response = townGraph.isPathAvailable(
      sourceTown,
      destinationTown,
      stoppageTowns
    );
    setCost(response);
    let routeListObject = {};
    townGraph.numberOfRoutes(sourceTown, destinationTown, {}, routeListObject);
    setRouteCount(Object.keys(routeListObject).length);
  };

  return (
    <React.Fragment>
      <div class="container">
        <h1 class="heading">Amity Delivery Services</h1>
        <div class="content">
          <form>
            <div class="main-inputs-div">
              <SelectDropDown
                key="source"
                eleName="source"
                onChange={(value) => selectSourceTown(value)}
                value={sourceTown}
                towns={sourceTowns}
              />
              <SelectDropDown
                key="destination"
                eleName="destination"
                disabled={sourceTown === ""}
                onChange={(value) => selectDestinationTown(value)}
                value={destinationTown}
                towns={destinationTowns}
              />
            </div>
            <div class="stops-content">
              <SelectDropDown
                eleName="stops"
                disabled={sourceTown === "" || destinationTown === ""}
                onChange={(value) => selectStoppage(value)}
                value={""}
                towns={stoppageTownList}
              />
            </div>
            <div class="submit-btn-content">
              {stoppageTowns.length > 0 && (
                <div class="stops-text">
                  Stops : {stoppageTowns.map((each) => `${TOWN_NAMES[each]} `)}
                </div>
              )}

              <input
                type="reset"
                value="Reset"
                name="reset"
                onClick={(e) => reset(e)}
              />
              <input
                type="submit"
                value="Calculate Cost"
                name="submit"
                onClick={(e) => calculateCost(e)}
              />
            </div>
            {cost !== "" && (
              <div class="result-content">
                {cost !== "No Route Found"
                  ? `The cost for chosen route : ${cost}`
                  : cost}
                <br />
                {routeCount !== "" &&
                  `Total Path between ${TOWN_NAMES[sourceTown]} and ${TOWN_NAMES[destinationTown]} is ${routeCount}`}
              </div>
            )}
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

const SelectDropDown = (props) => {
  let placeholderText = "Select Town";
  if (props.eleName === "source") {
    placeholderText = "Select Source Town";
  } else if (props.eleName === "destination") {
    placeholderText = "Select Destination Town";
  } else if (props.eleName === "stops") {
    placeholderText = "Select Stops";
  }
  return (
    <select
      name={props.eleName}
      onChange={(e) => props.onChange(e.target.value)}
      value={props.value}
      disabled={props.disabled}
    >
      <option value="" disabled selected={props.value === ""}>
        {placeholderText}
      </option>
      {props.towns.map((each) => {
        return <option value={each.id}>{each.name}</option>;
      })}
    </select>
  );
};
