// Table seating configurations for HU, 3-max, 6-max, and 9-max MTT play.

export const TABLE_CONFIGS = {
  2: {
    label: "Heads-Up",
    positions: ["SB", "BB"],
    trainablePositions: ["SB"],
    callableFrom: ["BB"],
    reshovableFrom: ["BB"],
    rfiTrainablePositions: ["SB"],
  },
  3: {
    label: "3-Max",
    positions: ["BTN", "SB", "BB"],
    trainablePositions: ["BTN", "SB"],
    callableFrom: ["SB", "BB"],
    reshovableFrom: ["SB", "BB"],
    rfiTrainablePositions: ["BTN", "SB"],
  },
  6: {
    label: "6-Max",
    positions: ["UTG", "HJ", "CO", "BTN", "SB", "BB"],
    trainablePositions: ["UTG", "HJ", "CO", "BTN", "SB"],
    callableFrom: ["HJ", "CO", "BTN", "SB", "BB"],
    reshovableFrom: ["HJ", "CO", "BTN", "SB", "BB"],
    rfiTrainablePositions: ["UTG", "HJ", "CO", "BTN", "SB"],
  },
  9: {
    label: "9-Max",
    positions: ["UTG", "UTG1", "MP", "MP1", "HJ", "CO", "BTN", "SB", "BB"],
    trainablePositions: ["MP", "MP1", "HJ", "CO", "BTN", "SB"],
    callableFrom: ["HJ", "CO", "BTN", "SB", "BB"],
    reshovableFrom: ["HJ", "CO", "BTN", "SB", "BB"],
    rfiTrainablePositions: ["UTG", "UTG1", "MP", "MP1", "HJ", "CO", "BTN", "SB"],
  },
};

export const POSITION_LABELS = {
  UTG: "Under the Gun",
  UTG1: "UTG+1",
  MP: "Middle Position",
  MP1: "MP+1",
  HJ: "Hijack",
  CO: "Cutoff",
  BTN: "Button",
  SB: "Small Blind",
  BB: "Big Blind",
};
