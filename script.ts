type Grid = GridSquare[][];

type GridSquare = {
  lostDirections: number[][];
  hasLostScent: boolean;
};

type Robot = {
  xPosition: number;
  yPosition: number;
  direction: string;
  forwardCoordinate: number[];
  isLost: boolean;
};

enum Directions {
  N = "N",
  E = "E",
  S = "S",
  W = "W",
}

function handleClick() {
  let grid: Grid;
  let robot: Robot;

  const input = document.getElementById("input") as HTMLTextAreaElement;
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

  const outputElement = document.getElementById(
    "output"
  ) as HTMLParagraphElement;
  outputElement.innerText = `${robot.xPosition} ${robot.yPosition} ${robot.direction} ${robot.isLost ? "LOST" : ""}`;
}

function calculateForwardCoordinate(
  x: number,
  y: number,
  direction: Directions
) {
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

function updateSystem(
  grid: Grid,
  robot: Robot,
  command: string
): { grid: Grid; robot: Robot } {
  switch (command) {
    case "F":
      if (
        isOffGrid(grid, robot.forwardCoordinate[0], robot.forwardCoordinate[1])
      ) {
        robot.isLost = true;
        grid[robot.xPosition][robot.yPosition].hasLostScent = true;
        grid[robot.xPosition][robot.yPosition].lostDirections.push(
          robot.forwardCoordinate
        );
        break;
      }
      robot.xPosition = robot.forwardCoordinate[0];
      robot.yPosition = robot.forwardCoordinate[1];

      robot.forwardCoordinate = calculateForwardCoordinate(
        robot.xPosition,
        robot.yPosition,
        robot.direction as Directions
      );
      break;
    case "L":
      robot.direction = calculateNewDirection(
        robot.direction as Directions,
        "L"
      );
      robot.forwardCoordinate = calculateForwardCoordinate(
        robot.xPosition,
        robot.yPosition,
        robot.direction as Directions
      );
      break;
    case "R":
      robot.direction = calculateNewDirection(
        robot.direction as Directions,
        "R"
      );
      robot.forwardCoordinate = calculateForwardCoordinate(
        robot.xPosition,
        robot.yPosition,
        robot.direction as Directions
      );
      break;
  }

  return { grid, robot };
}

function isOffGrid(grid: Grid, x: number, y: number) {
  return x < 0 || y < 0 || x >= grid.length || y >= grid[0].length;
}

function calculateNewDirection(
  currentDirection: Directions,
  rotation: "L" | "R"
): Directions {
  const directionValues = Object.values(Directions) as Directions[];
  const currentIndex = directionValues.indexOf(currentDirection);
  const newIndex =
    (rotation === "L" ? currentIndex - 1 : currentIndex + 1) %
    directionValues.length;

  return directionValues[newIndex];
}

function buildGrid(upperXIndex: number, upperYIndex: number): Grid {
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

function setUpRobot(x: string, y: string, direction: string): Robot {
  // assuming for the moment that at least the robot's starting position is ON the grid (is this the case?)
  // TODO: validate x and y
  const xPosition = parseInt(x);
  const yPosition = parseInt(y);

  // TODO: validate directions
  const forwardCoordinate = calculateForwardCoordinate(
    xPosition,
    yPosition,
    direction as Directions
  );

  return {
    xPosition,
    yPosition,
    direction,
    forwardCoordinate,
    isLost: false,
  };
}
