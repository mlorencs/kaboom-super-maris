// Constants

const BLOCK_SIZE = 20;

const LEVEL1_ENEMY1_START_POSX = 280;
const LEVEL1_ENEMY1_END_POSX = 180;

const LEVEL1_ENEMY2_START_POSX = 380;
const LEVEL1_ENEMY2_END_POSX = 280;

const level1 = [
  "|                                |",
  "|                                |",
  "|                                |",
  "|                                |",
  "|                                |",
  "|  C   =?=C=                     |",
  "|                              $ |",
  "|                              -+|",
  "|                              []|",
  "|=========================  =====|",
];

const level2 = [
  "B                                B",
  "B                                B",
  "B                                B",
  "B                                B",
  "B                                B",
  "B  C   =?=C=                     B",
  "B                       $        B",
  "B                       -+       B",
  "B                       []       B",
  "B=========================  =====B",
];

const level3 = [
  //
];

const level4 = [
  //
];

const level5 = [
  //
];

const spriteMap = {
  X: () => [sprite("box"), area(), solid()],
  C: () => [sprite("surprise-block"), area(), solid(), "coin-surprise"],
  "?": () => [sprite("surprise-block"), area(), solid(), "mushroom-surprise"],

  "-": () => [sprite("tube-top-left"), area(), solid(), scale(0.5), "tube"],
  "+": () => [sprite("tube-top-right"), area(), solid(), scale(0.5), "tube"],
  "[": () => [sprite("tube-bottom-left"), area(), solid(), scale(0.5)],
  "]": () => [sprite("tube-bottom-right"), area(), solid(), scale(0.5)],

  $: () => [sprite("coin"), area(), solid(), "coin"],
  M: () => [sprite("mushroom"), area(), body(), solid(), "mushroom"],
};

const defaultSpriteMap = {
  ...spriteMap,

  "|": () => [
    rect(BLOCK_SIZE, BLOCK_SIZE),
    color(0, 0, 0),
    area(),
    solid(),
    "wall",
  ],
  "=": () => [sprite("cobble"), area(), solid()],
};

const alternativeSpriteMap = {
  ...spriteMap,

  B: () => [sprite("brick-alt"), area(), solid(), scale(0.5)],
  "=": () => [sprite("cobble-alt"), area(), solid(), scale(0.5)],
};

export const maps = [
  {
    level: level1,
    config: {
      ...defaultSpriteMap,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
    },
    enemies: [
      {
        xStartPos: LEVEL1_ENEMY1_START_POSX,
        xEndPos: LEVEL1_ENEMY1_END_POSX,
        y: 0,
      },
      {
        xStartPos: LEVEL1_ENEMY2_START_POSX,
        xEndPos: LEVEL1_ENEMY2_END_POSX,
        y: 0,
      },
    ],
  },
  {
    level: level2,
    config: {
      ...alternativeSpriteMap,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
    },
  },
  {
    level: level3,
    config: {
      ...defaultSpriteMap,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
    },
  },
  {
    level: level4,
    config: {
      ...defaultSpriteMap,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
    },
  },
  {
    level: level5,
    config: {
      ...defaultSpriteMap,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
    },
  },
];
