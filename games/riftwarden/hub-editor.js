const canvas = document.getElementById("hubCanvas");
const ctx = canvas.getContext("2d");
const toolButtons = Array.from(document.querySelectorAll("[data-tool]"));
const statusLine = document.getElementById("statusLine");
const selectedText = document.getElementById("selectedText");
const exportText = document.getElementById("exportText");
const exportButton = document.getElementById("exportButton");
const importButton = document.getElementById("importButton");
const resetButton = document.getElementById("resetButton");
const copyButton = document.getElementById("copyButton");
const saveButton = document.getElementById("saveButton");
const loadButton = document.getElementById("loadButton");
const clearTextButton = document.getElementById("clearTextButton");

const MAP_COLS = 56;
const MAP_ROWS = 42;
const CELL = 18;
const STORAGE_KEY = "riftwardenHubEditorDraft";

const defaultWallRows = [
  "########################################################",
  "#......................................................#",
  "#..............######..................................#",
  "#.............##....##.............######..............#",
  "#............##......###.........##.....##.............#",
  "#............#.........#.........#.......#.............#",
  "#............#.........#........#........#.............#",
  "#............#.........#........#........##............#",
  "#............#.........#........##.......##............#",
  "#............##........#.........#.....###.............#",
  "#........#....#........###########..####....#######....#",
  "#........###..#####.....#########...#......##.....##...#",
  "#...#####..###....##....########...##.....##.......#...#",
  "#.##..###....###...##.............##......#........##..#",
  "###.....#......##..###............#.......#.........#..#",
  "##......##########...##...........#....####.........#..#",
  "##...............##..#............#...##............#..#",
  "##................#..#............#..##.............#..#",
  "##......###.......##.#............#.##....###......##..#",
  "###....##.#........###............###.....####....##...#",
  "#.##...#..#.........##............##......#####.###....#",
  "#..#####..#...............................#######.###..#",
  "#.#########...............................####......##.#",
  "###...#...#...............................####.......#.#",
  "##....##..#...............................####.......#.#",
  "##.....####..........#............#..................#.#",
  "##...................#............#..................#.#",
  "##...................#............#.......####.......#.#",
  "##......###..........#............#.......####......##.#",
  "###.....###..........#............#.......####.....##..#",
  "###########..........#............#.......####....##...#",
  "###########.....#....#............#.......###########..#",
  "####..#####..........#............#.......######....####",
  "###....####..........#............#.......####........##",
  "##......###..........#............#...................##",
  "##...................##############...................##",
  "##........................................###.........##",
  "##......###.................................#.........##",
  "###....##.#.................................###......###",
  "#.##..##..#...................................###..###.#",
  "#..#################################################...#",
  "########################################################"
];

const defaultPortals = [
  ["graveyard-1", "Graveyard 1", 16, 7, "#d9d3c2"], ["graveyard-2", "Graveyard 2", 17, 5.5, "#d9d3c2"], ["graveyard-3", "Graveyard 3", 18.5, 5, "#d9d3c2"], ["graveyard-4", "Graveyard 4", 20, 5.5, "#d9d3c2"], ["graveyard-5", "Graveyard Boss", 21, 7, "#d9d3c2", true],
  ["mountains-1", "Mountain 1", 34.5, 7, "#a68d66"], ["mountains-2", "Mountain 2", 35.5, 5.5, "#a68d66"], ["mountains-3", "Mountain 3", 37, 5, "#a68d66"], ["mountains-4", "Mountain 4", 38.5, 5.5, "#a68d66"], ["mountains-5", "Mountain Boss", 39.5, 7, "#a68d66", true],
  ["castle-1", "Castle 1", 4.75, 19, "#9c80ff"], ["castle-2", "Castle 2", 3.75, 18, "#9c80ff"], ["castle-3", "Castle 3", 3.25, 17, "#9c80ff"], ["castle-4", "Castle 4", 3.75, 16, "#9c80ff"], ["castle-5", "Castle Boss", 4.75, 15, "#9c80ff", true],
  ["skyships-1", "Skyship 1", 4.75, 29, "#77a8ff"], ["skyships-2", "Skyship 2", 4, 28, "#77a8ff"], ["skyships-3", "Skyship 3", 3.5, 27, "#77a8ff"], ["skyships-4", "Skyship 4", 4, 26, "#77a8ff"], ["skyships-5", "Skyship Boss", 4.75, 25, "#77a8ff", true],
  ["forest-1", "Forest 1", 5.5, 38, "#63f0c4"], ["forest-2", "Forest 2", 4.5, 37, "#63f0c4"], ["forest-3", "Forest 3", 4, 36, "#63f0c4"], ["forest-4", "Forest 4", 4.5, 35, "#63f0c4"], ["forest-5", "Forest Boss", 5.5, 34, "#63f0c4", true],
  ["desertTemple-1", "Desert 1", 46.75, 13, "#e6cc80"], ["desertTemple-2", "Desert 2", 47.75, 13.5, "#e6cc80"], ["desertTemple-3", "Desert 3", 48.25, 14.5, "#e6cc80"], ["desertTemple-4", "Desert 4", 47.75, 15.5, "#e6cc80"], ["desertTemple-5", "Desert Boss", 46.75, 16.5, "#e6cc80", true],
  ["ice-1", "Ice 1", 49.5, 24, "#9be7ff"], ["ice-2", "Ice 2", 50.25, 25, "#9be7ff"], ["ice-3", "Ice 3", 50.75, 26, "#9be7ff"], ["ice-4", "Ice 4", 50.25, 27, "#9be7ff"], ["ice-5", "Ice Boss", 49.5, 28, "#9be7ff", true],
  ["dream-1", "Dream 1", 50.25, 34, "#d58cff"], ["dream-2", "Dream 2", 50.75, 35, "#d58cff"], ["dream-3", "Dream 3", 50.75, 36, "#d58cff"], ["dream-4", "Dream 4", 50, 37, "#d58cff"], ["dream-5", "Dream Boss", 48.75, 37.5, "#d58cff", true],
  ["bossShard-1", "Boss Shard", 28, 13.5, "#e6cc80", true], ["runestone-1", "Runestone", 28, 23.5, "#9df7a4", true],
  ["demonMarch-1", "Demon Gate 1", 25.5, 32, "#ff668a"], ["demonMarch-2", "Demon Gate 2", 28, 33, "#ff668a"], ["demonMarch-3", "Demon Gate 3", 30.5, 32, "#ff668a"],
  ["finalDemon-1", "Final Boss", 28, 30, "#ff335f", true]
].map(([id, label, x, y, color, boss = false]) => ({ id, label, x, y, color, boss }));

let activeTool = "drag";
let walls = new Set();
let portals = [];
let spawn = { id: "spawn", label: "Spawn", x: 28, y: 18.5, color: "#f0ebff" };
let market = { id: "market", label: "Market", x: 28, y: 18.5, radius: 1.45, color: "#f7cc78" };
let isPainting = false;
let dragging = null;
let selected = null;

function key(col, row) {
  return `${col},${row}`;
}

function buildDefaultLayout() {
  walls = new Set();
  portals = defaultPortals.map((portal) => ({ ...portal }));
  spawn = { id: "spawn", label: "Spawn", x: 28, y: 18.5, color: "#f0ebff" };
  market = { id: "market", label: "Market", x: 28, y: 18.5, radius: 1.45, color: "#f7cc78" };

  for (let row = 0; row < MAP_ROWS; row += 1) {
    const rowText = defaultWallRows[row] || "";
    for (let col = 0; col < MAP_COLS; col += 1) {
      if (rowText[col] === "#") {
        walls.add(key(col, row));
      }
    }
  }
  for (const portal of portals) {
    clearPatch(portal.x, portal.y, 1);
  }
  clearPatch(spawn.x, spawn.y, 2);
  clearPatch(market.x, market.y, 2);
  selected = null;
}

function clearPatch(x, y, radiusTiles) {
  const centerCol = Math.round(x);
  const centerRow = Math.round(y);
  for (let col = centerCol - radiusTiles; col <= centerCol + radiusTiles; col += 1) {
    for (let row = centerRow - radiusTiles; row <= centerRow + radiusTiles; row += 1) {
      walls.delete(key(col, row));
    }
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function snap(value) {
  return Math.round(value * 2) / 2;
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function tileFromEvent(event) {
  const point = canvasPoint(event);
  return {
    col: clamp(Math.floor(point.x / CELL), 0, MAP_COLS - 1),
    row: clamp(Math.floor(point.y / CELL), 0, MAP_ROWS - 1),
    x: point.x / CELL,
    y: point.y / CELL
  };
}

function paintTile(col, row) {
  if (activeTool === "wall") {
    walls.add(key(col, row));
  } else if (activeTool === "floor") {
    walls.delete(key(col, row));
  }
}

function markerDistance(marker, x, y) {
  return Math.hypot(marker.x - x, marker.y - y);
}

function findMarker(x, y) {
  const markers = [...portals, spawn, market];
  let best = null;
  let bestDistance = Infinity;
  for (const marker of markers) {
    const distance = markerDistance(marker, x, y);
    if (distance < bestDistance) {
      best = marker;
      bestDistance = distance;
    }
  }
  return bestDistance <= 1.25 ? best : null;
}

function drawGrid() {
  ctx.fillStyle = "#080911";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < MAP_ROWS; row += 1) {
    for (let col = 0; col < MAP_COLS; col += 1) {
      const wall = walls.has(key(col, row));
      ctx.fillStyle = wall ? "#252137" : (col + row) % 2 ? "#101322" : "#0d101d";
      ctx.fillRect(col * CELL, row * CELL, CELL, CELL);
    }
  }

  ctx.strokeStyle = "rgba(156, 128, 255, 0.14)";
  ctx.lineWidth = 1;
  for (let col = 0; col <= MAP_COLS; col += 1) {
    ctx.beginPath();
    ctx.moveTo(col * CELL, 0);
    ctx.lineTo(col * CELL, MAP_ROWS * CELL);
    ctx.stroke();
  }
  for (let row = 0; row <= MAP_ROWS; row += 1) {
    ctx.beginPath();
    ctx.moveTo(0, row * CELL);
    ctx.lineTo(MAP_COLS * CELL, row * CELL);
    ctx.stroke();
  }
}

function drawMarker(marker, radiusTiles, label) {
  const x = marker.x * CELL;
  const y = marker.y * CELL;
  const radius = radiusTiles * CELL;
  const active = selected && selected.id === marker.id;

  ctx.save();
  ctx.fillStyle = `${marker.color}33`;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0b0a12";
  ctx.strokeStyle = active ? "#ffffff" : marker.color;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = active ? "#ffffff" : marker.color;
  ctx.font = marker.boss ? "900 10px Inter, sans-serif" : "900 11px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
  ctx.restore();
}

function draw() {
  drawGrid();

  ctx.save();
  ctx.fillStyle = "rgba(247, 204, 120, 0.12)";
  ctx.strokeStyle = "#f7cc78";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(market.x * CELL, market.y * CELL, market.radius * CELL, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f7cc78";
  ctx.font = "800 9px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Market", market.x * CELL, market.y * CELL - market.radius * CELL - 5);
  ctx.restore();

  for (const portal of portals) {
    const label = portal.boss ? "B" : portal.id.split("-").pop();
    drawMarker(portal, portal.boss ? 0.55 : 0.46, label);
  }
  drawMarker(spawn, 0.52, "S");
  updateSelectedText();
}

function updateSelectedText() {
  if (!selected) {
    selectedText.textContent = "Nothing selected.";
    return;
  }
  selectedText.textContent = `${selected.label || selected.id}: x ${selected.x.toFixed(1)}, y ${selected.y.toFixed(1)}`;
}

function layoutPayload() {
  const rows = [];
  for (let row = 0; row < MAP_ROWS; row += 1) {
    let line = "";
    for (let col = 0; col < MAP_COLS; col += 1) {
      line += walls.has(key(col, row)) ? "#" : ".";
    }
    rows.push(line);
  }
  return {
    tool: "riftwarden-hub-editor",
    mapCols: MAP_COLS,
    mapRows: MAP_ROWS,
    spawn: { x: spawn.x, y: spawn.y },
    market: { x: market.x, y: market.y, radius: market.radius },
    portals: portals.map(({ id, label, x, y, boss }) => ({ id, label, x, y, boss })),
    walls: rows
  };
}

function exportLayout() {
  exportText.value = JSON.stringify(layoutPayload(), null, 2);
  statusLine.textContent = "Layout exported. Paste this JSON to me when it looks right.";
}

function importLayout(raw) {
  const payload = JSON.parse(raw);
  if (!Array.isArray(payload.walls) || payload.walls.length !== MAP_ROWS) {
    throw new Error("Expected walls to be an array of 42 strings.");
  }
  walls = new Set();
  payload.walls.forEach((rowText, row) => {
    for (let col = 0; col < Math.min(rowText.length, MAP_COLS); col += 1) {
      if (rowText[col] === "#") {
        walls.add(key(col, row));
      }
    }
  });
  if (payload.spawn) {
    spawn.x = Number(payload.spawn.x);
    spawn.y = Number(payload.spawn.y);
  }
  if (payload.market) {
    market.x = Number(payload.market.x);
    market.y = Number(payload.market.y);
    market.radius = Number(payload.market.radius) || market.radius;
  }
  if (Array.isArray(payload.portals)) {
    const byId = new Map(portals.map((portal) => [portal.id, portal]));
    for (const incoming of payload.portals) {
      const portal = byId.get(incoming.id);
      if (portal) {
        portal.x = Number(incoming.x);
        portal.y = Number(incoming.y);
      }
    }
  }
  selected = null;
  statusLine.textContent = "Layout imported.";
  draw();
}

for (const button of toolButtons) {
  button.addEventListener("click", () => {
    activeTool = button.dataset.tool;
    toolButtons.forEach((toolButton) => toolButton.classList.toggle("is-active", toolButton === button));
    statusLine.textContent = activeTool === "drag" ? "Drag portals, market, or spawn." : `${activeTool} painting enabled.`;
  });
}

canvas.addEventListener("mousedown", (event) => {
  const pos = tileFromEvent(event);
  if (activeTool === "drag") {
    dragging = findMarker(pos.x, pos.y);
    selected = dragging;
  } else {
    isPainting = true;
    paintTile(pos.col, pos.row);
  }
  draw();
});

canvas.addEventListener("mousemove", (event) => {
  const pos = tileFromEvent(event);
  statusLine.textContent = `tile ${pos.col}, ${pos.row} | ${activeTool}`;
  if (dragging) {
    dragging.x = clamp(snap(pos.x), 1, MAP_COLS - 2);
    dragging.y = clamp(snap(pos.y), 1, MAP_ROWS - 2);
    clearPatch(dragging.x, dragging.y, dragging.id === "market" ? 2 : 1);
    draw();
  } else if (isPainting) {
    paintTile(pos.col, pos.row);
    draw();
  }
});

window.addEventListener("mouseup", () => {
  dragging = null;
  isPainting = false;
});

canvas.addEventListener("contextmenu", (event) => event.preventDefault());

exportButton.addEventListener("click", exportLayout);

importButton.addEventListener("click", () => {
  try {
    importLayout(exportText.value);
  } catch (error) {
    statusLine.textContent = `Import failed: ${error.message}`;
  }
});

resetButton.addEventListener("click", () => {
  buildDefaultLayout();
  statusLine.textContent = "Reset to the current game hub layout.";
  draw();
});

copyButton.addEventListener("click", async () => {
  if (!exportText.value.trim()) {
    exportLayout();
  }
  try {
    await navigator.clipboard.writeText(exportText.value);
    statusLine.textContent = "Export copied.";
  } catch {
    exportText.select();
    statusLine.textContent = "Select/copy the export text manually.";
  }
});

saveButton.addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layoutPayload()));
  statusLine.textContent = "Draft saved in this browser.";
});

loadButton.addEventListener("click", () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    statusLine.textContent = "No saved draft found.";
    return;
  }
  importLayout(saved);
});

clearTextButton.addEventListener("click", () => {
  exportText.value = "";
});

buildDefaultLayout();
draw();
