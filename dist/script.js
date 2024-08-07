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
    const [gridLength, gridHeight] = instructions[0].split(" ").map((str) => parseInt(str));
    grid = buildGrid(gridLength, gridHeight);
    const [robotX, robotY, robotDirection] = instructions[1].split(" ");
    robot = setUpRobot(robotX, robotY, robotDirection);
    const commands = instructions[2].split("");
    commands.forEach((command) => {
        if (robot.isLost) {
            return;
        }
        ({ grid, robot } = updateSystem(grid, robot, command));
    });
    const outputElement = document.getElementById("output");
    outputElement.innerText = `${robot.xPosition} ${robot.yPosition} ${robot.direction} ${robot.isLost ? "LOST" : ""}`;
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
function updateSystem(grid, robot, command) {
    switch (command) {
        case "F":
            if (isOffGrid(grid, robot.forwardCoordinate[0], robot.forwardCoordinate[1])) {
                robot.isLost = true;
                grid[robot.xPosition][robot.yPosition].hasLostScent = true;
                grid[robot.xPosition][robot.yPosition].lostDirections.push(robot.forwardCoordinate);
                break;
            }
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
    return { grid, robot };
}
function isOffGrid(grid, x, y) {
    return x < 0 || y < 0 || x >= grid.length || y >= grid[0].length;
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
