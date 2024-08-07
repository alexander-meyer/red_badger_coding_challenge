type Grid = GridSquare[][];

type GridSquare = {
  lostDirections: number[][];
  hasLostScent: boolean;
};

type Robot = {
  xPosition: number;
  yPosition: number;
  direction: string;
  isLost: boolean;
};

function handleClick() {
  let grid: Grid;
  let robot: Robot;

  const input = document.getElementById("input") as HTMLTextAreaElement;
  // TODO: validate input
  const instructions = input.value.split("\n");

  const [gridLength, gridHeight] = instructions[0]
    .split(" ")
    .map((str) => parseInt(str));
  grid = buildGrid(gridLength, gridHeight);

  const [robotX, robotY, robotDirection] = instructions[1].split(" ");
  robot = setUpRobot(robotX, robotY, robotDirection);

  const outputElement = document.getElementById(
    "output"
  ) as HTMLParagraphElement;
  outputElement.innerText = JSON.stringify(robot);
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

  return {
    xPosition,
    yPosition,
    direction,
    isLost: false,
  };
}
