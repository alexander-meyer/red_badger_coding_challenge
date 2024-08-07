var Directions;
(function (Directions) {
    Directions["N"] = "N";
    Directions["E"] = "E";
    Directions["S"] = "S";
    Directions["W"] = "W";
})(Directions || (Directions = {}));
function handleClick() {
    var grid;
    var robot;
    var input = document.getElementById("input");
    // TODO: validate input
    var instructions = input.value.split("\n");
    var _a = instructions[0]
        .split(" ")
        .map(function (str) { return parseInt(str); }), gridLength = _a[0], gridHeight = _a[1];
    grid = buildGrid(gridLength, gridHeight);
    var _b = instructions[1].split(" "), robotX = _b[0], robotY = _b[1], robotDirection = _b[2];
    robot = setUpRobot(robotX, robotY, robotDirection);
    var outputElement = document.getElementById("output");
    outputElement.innerText = JSON.stringify(robot);
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
function buildGrid(upperXIndex, upperYIndex) {
    // Because the user input for grid size references the index, not the size, we need to add 1 here to get the actual grid size
    var gridSize = upperXIndex + 1;
    var gridLength = upperYIndex + 1;
    var grid = new Array(gridSize);
    for (var i = 0; i < gridSize; i++) {
        grid[i] = new Array(gridLength);
        for (var j = 0; j < gridLength; j++) {
            grid[i][j] = { lostDirections: [], hasLostScent: false };
        }
    }
    return grid;
}
function setUpRobot(x, y, direction) {
    // assuming for the moment that at least the robot's starting position is ON the grid (is this the case?)
    // TODO: validate x and y
    var xPosition = parseInt(x);
    var yPosition = parseInt(y);
    // TODO: validate directions
    var forwardCoordinate = calculateForwardCoordinate(xPosition, yPosition, direction);
    return {
        xPosition: xPosition,
        yPosition: yPosition,
        direction: direction,
        forwardCoordinate: forwardCoordinate,
        isLost: false,
    };
}
