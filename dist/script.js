"use strict";
var Directions;
(function (Directions) {
    Directions["N"] = "N";
    Directions["E"] = "E";
    Directions["S"] = "S";
    Directions["W"] = "W";
})(Directions || (Directions = {}));
function handleClick() {
    let grid;
    let robot;
    const input = document.getElementById("input");
    // TODO: validate input
    const instructions = input.value.split("\n");
    const [gridLength, gridHeight] = instructions[0]
        .split(" ")
        .map((str) => parseInt(str));
    grid = buildGrid(gridLength, gridHeight);
    const [robotX, robotY, robotDirection] = instructions[1].split(" ");
    robot = setUpRobot(robotX, robotY, robotDirection);
    const commands = instructions[2].split("");
    commands.forEach((command) => {
        robot = updateRobot(robot, command);
    });
    const outputElement = document.getElementById("output");
    outputElement.innerText = `${robot.xPosition} ${robot.yPosition} ${robot.direction}`;
}
function calculateForwardCoordinate(x, y, direction) {
    switch (direction) {
        case Directions.N:
            return [x, y + 1];
        case Directions.E:
            return [x + 1, y];
        case Directions.S:
            return [x, y - 1];
        case Directions.W:
            return [x - 1, y];
    }
}
function updateRobot(robot, command) {
    switch (command) {
        case "F":
            robot.xPosition = robot.forwardCoordinate[0];
            robot.yPosition = robot.forwardCoordinate[1];
            robot.forwardCoordinate = calculateForwardCoordinate(robot.xPosition, robot.yPosition, robot.direction);
            break;
        case "L":
            robot.direction = calculateNewDirection(robot.direction, "L");
            robot.forwardCoordinate = calculateForwardCoordinate(robot.xPosition, robot.yPosition, robot.direction);
            break;
        case "R":
            robot.direction = calculateNewDirection(robot.direction, "R");
            robot.forwardCoordinate = calculateForwardCoordinate(robot.xPosition, robot.yPosition, robot.direction);
            break;
    }
    return robot;
}
function calculateNewDirection(currentDirection, rotation) {
    const directionValues = Object.values(Directions);
    const currentIndex = directionValues.indexOf(currentDirection);
    const newIndex = (rotation === "L" ? currentIndex - 1 : currentIndex + 1) %
        directionValues.length;
    return directionValues[newIndex];
}
function buildGrid(upperXIndex, upperYIndex) {
    // Because the user input for grid size references the index, not the size, we need to add 1 here to get the actual grid size
    const gridSize = upperXIndex + 1;
    const gridLength = upperYIndex + 1;
    const grid = new Array(gridSize);
    for (let i = 0; i < gridSize; i++) {
        grid[i] = new Array(gridLength);
        for (let j = 0; j < gridLength; j++) {
            grid[i][j] = { lostDirections: [], hasLostScent: false };
        }
    }
    return grid;
}
function setUpRobot(x, y, direction) {
    // assuming for the moment that at least the robot's starting position is ON the grid (is this the case?)
    // TODO: validate x and y
    const xPosition = parseInt(x);
    const yPosition = parseInt(y);
    // TODO: validate directions
    const forwardCoordinate = calculateForwardCoordinate(xPosition, yPosition, direction);
    return {
        xPosition,
        yPosition,
        direction,
        forwardCoordinate,
        isLost: false,
    };
}
