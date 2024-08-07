function handleClick() {
  let grid: Grid;

  const outputElement = document.getElementById(
    "output"
  ) as HTMLParagraphElement;
  const inputElement = document.getElementById("input") as HTMLTextAreaElement;
  // TODO: validate input
  const userInput = inputElement.value.split("\n");

  const [gridLength, gridHeight] = userInput[0].split(" ").map((str) => parseInt(str));
  grid = buildGrid(gridLength, gridHeight);

  // Get each pair of instructions for the robot
  for (let i = 1; i < userInput.length; i += 2) {
    const [robotX, robotY, robotDirection] = userInput[i].split(" ");
    let newRobot = setUpRobot(robotX, robotY, robotDirection);
    const commands = userInput[i + 1].split("");

    commands.forEach((command) => {
      if (newRobot.isLost) {
        return;
      }
      ({ grid, robot: newRobot } = updateSystem(grid, newRobot, command));
    });

    outputElement.innerText += `${newRobot.xPosition} ${newRobot.yPosition} ${newRobot.direction} ${newRobot.isLost ? "LOST" : ""} \n`;
  }
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
  command: string,
): { grid: Grid; robot: Robot } {
  switch (command) {
    case "F":
      const hasLostScent = grid[robot.xPosition][robot.yPosition].hasLostScent;

      const forwardCoordStr = JSON.stringify(robot.forwardCoordinate);
      const includesForwardCoord = grid[robot.xPosition][robot.yPosition].lostDirections.some(coord => JSON.stringify(coord) === forwardCoordStr);

      // For some reason, this code does not seem to work as expected; it is borking up the robot's direction and forwardCoordinate properties :/

      // if (hasLostScent && includesForwardCoord) {
      //   break;
      // }

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

// tried to put types in a separate file but compiler was complaining :'( 

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