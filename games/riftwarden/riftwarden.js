    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    const hpStat = document.getElementById("hpStat");
    const levelStat = document.getElementById("levelStat");
    const goldStat = document.getElementById("goldStat");
    const classStat = document.getElementById("classStat");
    const floorStat = document.getElementById("floorStat");
    const coreStat = document.getElementById("coreStat");
    const attackStat = document.getElementById("attackStat");
    const skillStat = document.getElementById("skillStat");
    const dashStat = document.getElementById("dashStat");
    const objectiveText = document.getElementById("objectiveText");
    const classSummary = document.getElementById("classSummary");
    const characterSelect = document.getElementById("characterSelect");
    const characterNameInput = document.getElementById("characterNameInput");
    const characterRoster = document.getElementById("characterRoster");
    const characterClassButtons = Array.from(document.querySelectorAll("[data-select-class]"));
    const startAdventureButton = document.getElementById("startAdventureButton");
    const secretNameHint = document.getElementById("secretNameHint");
    const classButtons = Array.from(document.querySelectorAll("[data-class]"));
    const heroNameValue = document.getElementById("heroNameValue");
    const changeHeroButton = document.getElementById("changeHeroButton");
    const sagePanel = document.getElementById("sagePanel");
    const sageQueueText = document.getElementById("sageQueueText");
    const sageMessage = document.getElementById("sageMessage");
    const sageElementButtons = Array.from(document.querySelectorAll("[data-sage-element]"));
    const sageCastButtons = Array.from(document.querySelectorAll("[data-sage-cast]"));
    const shopText = document.getElementById("shopText");
    const shopList = document.getElementById("shopList");
    const questList = document.getElementById("questList");
    const statPointText = document.getElementById("statPointText");
    const statButtons = Array.from(document.querySelectorAll("[data-stat]"));
    const levelStatCard = document.getElementById("levelStatCard");
    const coreStatCard = document.getElementById("coreStatCard");
    const sheetCard = document.getElementById("sheetCard");
    const damageStat = document.getElementById("damageStat");
    const spellStat = document.getElementById("spellStat");
    const speedStat = document.getElementById("speedStat");
    const resistStat = document.getElementById("resistStat");
    const dropStat = document.getElementById("dropStat");
    const nextFloorButton = document.getElementById("nextFloorButton");
    const resetButton = document.getElementById("resetButton");

    const TILE = 64;
    const MAP_COLS = 56;
    const MAP_ROWS = 42;
    const WORLD_W = MAP_COLS * TILE;
    const WORLD_H = MAP_ROWS * TILE;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const TAU = Math.PI * 2;
    const SHOP_ZONE = { x: TILE * 4.5, y: TILE * 4.5, radius: 118 };
    const HUB_SPAWN = { x: TILE * 28, y: TILE * 18.5 };
    const HUB_MARKET = { x: TILE * 28, y: TILE * 18.5, radius: 92 };
    const DEFAULT_HERO_NAME = "Warden";
    const SECRET_NAME_CLASSES = {
      jzael: "sage",
      pojo: "pojo"
    };

    const ELEMENT_COLORS = {
      physical: "#f0ebff",
      fire: "#ff8b4a",
      water: "#4bd9ff",
      cold: "#9be7ff",
      ice: "#b7f0ff",
      steam: "#d7d7d7",
      poison: "#78d85a",
      lightning: "#ffe873",
      earth: "#b88f5a",
      life: "#9df7a4",
      light: "#fff1a8",
      holy: "#f7f0a8",
      dark: "#9c80ff",
      nature: "#63f0c4",
      arcane: "#9c80ff",
      shield: "#f7cc78",
      wind: "#d8f7ff"
    };

    const THEME_PALETTES = {
      graveyard: { floorA: "#10131a", floorB: "#141620", wall: "#242435", grid: "rgba(217, 211, 194, 0.07)", wallGrid: "rgba(217, 211, 194, 0.13)" },
      mountain: { floorA: "#161411", floorB: "#1d1913", wall: "#312819", grid: "rgba(166, 141, 102, 0.08)", wallGrid: "rgba(230, 204, 128, 0.12)" },
      castle: { floorA: "#111322", floorB: "#17172a", wall: "#29263a", grid: "rgba(156, 128, 255, 0.08)", wallGrid: "rgba(247, 204, 120, 0.13)" },
      skyship: { floorA: "#0f1722", floorB: "#121c2d", wall: "#1f2b3f", grid: "rgba(119, 168, 255, 0.1)", wallGrid: "rgba(155, 231, 255, 0.15)" },
      forest: { floorA: "#0d1712", floorB: "#101d16", wall: "#1d3528", grid: "rgba(99, 240, 196, 0.08)", wallGrid: "rgba(157, 247, 164, 0.12)" },
      desert: { floorA: "#1d160b", floorB: "#241a0d", wall: "#3a2b13", grid: "rgba(230, 204, 128, 0.09)", wallGrid: "rgba(255, 241, 168, 0.14)" },
      ice: { floorA: "#0e1720", floorB: "#101e2b", wall: "#1c3546", grid: "rgba(155, 231, 255, 0.1)", wallGrid: "rgba(183, 240, 255, 0.16)" },
      dream: { floorA: "#161027", floorB: "#1d1230", wall: "#2a1747", grid: "rgba(213, 140, 255, 0.1)", wallGrid: "rgba(163, 53, 238, 0.16)" },
      shard: { floorA: "#17150f", floorB: "#1f1b10", wall: "#342d18", grid: "rgba(230, 204, 128, 0.1)", wallGrid: "rgba(247, 204, 120, 0.16)" },
      runestone: { floorA: "#101a15", floorB: "#132219", wall: "#203526", grid: "rgba(157, 247, 164, 0.1)", wallGrid: "rgba(99, 240, 196, 0.16)" },
      demon: { floorA: "#1c0e16", floorB: "#250f19", wall: "#3a1422", grid: "rgba(255, 102, 138, 0.1)", wallGrid: "rgba(255, 51, 95, 0.17)" },
      final: { floorA: "#16080e", floorB: "#220912", wall: "#3b0f20", grid: "rgba(255, 51, 95, 0.11)", wallGrid: "rgba(247, 204, 120, 0.2)" }
    };

    const HUB_WALL_ROWS = [
      "########################################################",
      "#......................................................#",
      "#..............######..............######..............#",
      "#.............##....##............##....##.............#",
      "#............##......###........###......##............#",
      "#............#.........#........#.........#............#",
      "#............#.........#........#.........#............#",
      "#............#.........#........#.........#............#",
      "#............#.........#........#.........#............#",
      "#............##........#........#........##............#",
      "#........#....#........##########........#....#........#",
      "#........###..#####.....########.....#####..###........#",
      "#...#####..###....##....########....##....###..#####...#",
      "#.##..###....###...##..............##...###....###..##.#",
      "###.....#......##..###............###..##......#.....###",
      "##......##########...##..........##...##########......##",
      "##...............##..#............#..##...............##",
      "##................#..#............#..#................##",
      "##......###.......##.#............#.##.......###......##",
      "###....##.#........###............###........#.##....###",
      "#.##...#..#.........##............##.........#..#...##.#",
      "#..#####..#..................................#..#####..#",
      "#.#########..................................#########.#",
      "###...#...#..................................#...#...###",
      "##....##..#..................................#..##....##",
      "##.....####..........#............#..........####.....##",
      "##...................#............#...................##",
      "##...................#............#...................##",
      "##......###..........#............#..........###......##",
      "###.....###..........#............#..........###.....###",
      "###########..........#............#..........###########",
      "###########.....#....#............#....#.....###########",
      "####..#####..........#............#..........#####..####",
      "###....####..........#............#..........####....###",
      "##......###..........#............#..........###......##",
      "##...................##############...................##",
      "##....................................................##",
      "##......###..................................###......##",
      "###....##.#..................................#.##....###",
      "#.##..##..#..................................#..##..##.#",
      "#..##################################################..#",
      "########################################################"
    ];

    const SAGE_ELEMENT_DEFS = {
      fire: { label: "Fire", key: "1" },
      cold: { label: "Cold", key: "2" },
      water: { label: "Water", key: "3" },
      lightning: { label: "Lightning", key: "4" },
      earth: { label: "Earth", key: "5" },
      life: { label: "Life", key: "6" },
      arcane: { label: "Arcane/Dark", key: "7" },
      shield: { label: "Shield", key: "8" },
      steam: { label: "Steam", key: "" },
      ice: { label: "Ice", key: "" },
      poison: { label: "Poison", key: "" },
      light: { label: "Light", key: "" }
    };

    const SAGE_ELEMENT_KEYS = {
      q: "fire",
      e: "cold",
      r: "water",
      f: "lightning",
      z: "earth",
      x: "life",
      c: "arcane",
      v: "shield",
      "1": "fire",
      "2": "cold",
      "3": "water",
      "4": "lightning",
      "5": "earth",
      "6": "life",
      "7": "arcane",
      "8": "shield"
    };

    const STATUS_DEFS = {
      wet: { label: "Wet", color: ELEMENT_COLORS.water, sticky: true },
      burning: { label: "Burning", color: ELEMENT_COLORS.fire, damageElement: "fire" },
      chilled: { label: "Chilled", color: ELEMENT_COLORS.cold },
      frozen: { label: "Frozen", color: ELEMENT_COLORS.ice },
      poisoned: { label: "Poisoned", color: ELEMENT_COLORS.poison, damageElement: "dark" },
      shocked: { label: "Shocked", color: ELEMENT_COLORS.lightning },
      steamed: { label: "Steamed", color: ELEMENT_COLORS.steam, sticky: true }
    };

    const CLASS_DEFS = {
      warrior: {
        name: "Warrior",
        summary: "Warriors survive close quarters, scale hardest with Strength, and carve packs with a physical rift cleave.",
        stats: { strength: 9, intelligence: 2, agility: 4 },
        baseHp: 146,
        baseSpeed: 202,
        attackElement: "physical",
        skillElement: "physical",
        attackName: "Throwing Axe",
        skillName: "Rift Cleave",
        mobilityName: "Shield Charge",
        guardElement: "physical",
        guard: 0.12
      },
      mage: {
        name: "Mage",
        summary: "Mages turn Intelligence into heavy elemental damage and use fire bolts with an arcane burst.",
        stats: { strength: 2, intelligence: 10, agility: 3 },
        baseHp: 98,
        baseSpeed: 196,
        attackElement: "fire",
        skillElement: "arcane",
        attackName: "Ember Bolt",
        skillName: "Arcane Nova",
        mobilityName: "Blink",
        guardElement: "fire",
        guard: 0.1
      },
      archer: {
        name: "Archer",
        summary: "Archers scale with Agility, fire quickly from range, and pierce enemies with nature-touched shots.",
        stats: { strength: 4, intelligence: 3, agility: 9 },
        baseHp: 112,
        baseSpeed: 228,
        attackElement: "nature",
        skillElement: "physical",
        attackName: "Warden Arrow",
        skillName: "Piercing Volley",
        mobilityName: "Disengage",
        guardElement: "physical",
        guard: 0.08
      },
      sage: {
        name: "Sage",
        summary: "Sages are fragile secret casters with no XP or levels; survival comes from spellcraft, not progression.",
        stats: { strength: 1, intelligence: 8, agility: 5 },
        baseHp: 90,
        baseSpeed: 204,
        attackElement: "arcane",
        skillElement: "arcane",
        attackName: "Direct Cast",
        skillName: "Area Cast",
        mobilityName: "Combo Haste",
        guardElement: "dark",
        guard: 0.04,
        secret: true
      },
      pojo: {
        name: "Pojo",
        summary: "Pojo is a secret fire-breathing chicken that eats pickups for healing instead of taking their normal rewards.",
        stats: { strength: 3, intelligence: 6, agility: 9 },
        baseHp: 104,
        baseSpeed: 236,
        attackElement: "fire",
        skillElement: "fire",
        attackName: "Fireball",
        skillName: "Fire Breath",
        mobilityName: "Flutter Rush",
        guardElement: "fire",
        guard: 0.16,
        secret: true
      }
    };

    const ENEMY_DEFS = {
      goblin: { name: "Goblin Cutpurse", family: "humanoid", radius: 14, hp: 32, speed: 132, damage: 7, damageElement: "physical", xp: 8, gold: 6, color: "#63f0c4", resists: { nature: 0.78, fire: 1.25, physical: 1.05 } },
      orc: { name: "Orc Breaker", family: "humanoid", radius: 21, hp: 92, speed: 88, damage: 15, damageElement: "physical", xp: 22, gold: 14, color: "#5aa66d", resists: { physical: 0.82, arcane: 1.3, fire: 1.12 } },
      troll: { name: "Troll Mauler", family: "humanoid", radius: 25, hp: 142, speed: 76, damage: 21, damageElement: "physical", xp: 34, gold: 18, color: "#6c8f55", resists: { physical: 0.72, fire: 1.45, poison: 0.7 } },
      zombie: { name: "Bog Zombie", family: "undead", radius: 16, hp: 54, speed: 76, damage: 10, damageElement: "dark", xp: 14, gold: 8, color: "#7b8f5a", resists: { dark: 0.5, nature: 0.75, holy: 1.7, fire: 1.35 } },
      skeleton: { name: "Bone Archer", family: "undead", radius: 18, hp: 62, speed: 104, damage: 12, damageElement: "physical", xp: 18, gold: 11, color: "#d9d3c2", resists: { physical: 0.9, dark: 0.62, holy: 1.85, fire: 1.1 } },
      ghoul: { name: "Grave Ghoul", family: "undead", radius: 17, hp: 68, speed: 116, damage: 12, damageElement: "dark", xp: 18, gold: 9, color: "#8a9a69", resists: { dark: 0.5, holy: 1.75, fire: 1.28 } },
      fireImp: { name: "Cinder Imp", family: "fire", radius: 15, hp: 50, speed: 132, damage: 11, damageElement: "fire", xp: 15, gold: 9, color: "#ff8b4a", resists: { fire: 0.35, water: 1.8, nature: 1.1 } },
      cultist: { name: "Dark Cultist", family: "dark", radius: 19, hp: 72, speed: 106, damage: 13, damageElement: "dark", xp: 20, gold: 13, color: "#8e5cff", resists: { dark: 0.35, arcane: 0.82, holy: 1.9, physical: 1.05 } },
      mountainBeast: { name: "Crag Beast", family: "beast", radius: 22, hp: 108, speed: 94, damage: 18, damageElement: "earth", xp: 26, gold: 14, color: "#a68d66", resists: { earth: 0.55, lightning: 1.35, physical: 0.9 } },
      castleKnight: { name: "Castle Dreadguard", family: "armored", radius: 21, hp: 118, speed: 92, damage: 18, damageElement: "physical", xp: 28, gold: 17, color: "#7f89a3", resists: { physical: 0.62, lightning: 1.35, earth: 0.82 } },
      gargoyle: { name: "Stone Gargoyle", family: "construct", radius: 20, hp: 102, speed: 118, damage: 16, damageElement: "earth", xp: 28, gold: 15, color: "#9490a3", resists: { earth: 0.45, physical: 0.78, holy: 1.35 } },
      skyRaider: { name: "Sky Raider", family: "raider", radius: 17, hp: 76, speed: 136, damage: 14, damageElement: "lightning", xp: 22, gold: 14, color: "#77a8ff", resists: { lightning: 0.48, earth: 1.45, fire: 1.1 } },
      stormHarpy: { name: "Storm Harpy", family: "beast", radius: 18, hp: 82, speed: 148, damage: 13, damageElement: "lightning", xp: 24, gold: 14, color: "#9be7ff", resists: { lightning: 0.5, earth: 1.5 } },
      forestSpider: { name: "Venom Spider", family: "beast", radius: 16, hp: 70, speed: 124, damage: 12, damageElement: "poison", xp: 19, gold: 10, color: "#78d85a", resists: { poison: 0.45, fire: 1.55, nature: 0.6 } },
      forestTroll: { name: "Forest Troll", family: "humanoid", radius: 24, hp: 132, speed: 82, damage: 19, damageElement: "physical", xp: 32, gold: 17, color: "#4f8f5c", resists: { nature: 0.55, fire: 1.5, physical: 0.8 } },
      anubisGuard: { name: "Jackal Temple Guard", family: "desert", radius: 20, hp: 105, speed: 112, damage: 17, damageElement: "holy", xp: 28, gold: 18, color: "#d6b566", resists: { holy: 0.5, dark: 1.35, fire: 0.82 } },
      sandPriest: { name: "Sand Priest", family: "desert", radius: 17, hp: 84, speed: 102, damage: 15, damageElement: "fire", xp: 26, gold: 18, color: "#e3c178", resists: { fire: 0.55, water: 1.6, dark: 1.2 } },
      scarab: { name: "Obsidian Scarab", family: "desert", radius: 15, hp: 66, speed: 142, damage: 11, damageElement: "physical", xp: 18, gold: 10, color: "#2e2535", resists: { physical: 0.65, earth: 0.6, lightning: 1.35 } },
      iceWolf: { name: "Ice Wolf", family: "beast", radius: 17, hp: 78, speed: 154, damage: 13, damageElement: "cold", xp: 23, gold: 12, color: "#b7f0ff", resists: { cold: 0.42, fire: 1.65 } },
      polarBear: { name: "Frost Bear", family: "beast", radius: 26, hp: 154, speed: 86, damage: 23, damageElement: "cold", xp: 38, gold: 20, color: "#f0fbff", resists: { cold: 0.35, physical: 0.78, fire: 1.55 } },
      frostWitch: { name: "Frost Witch", family: "cold", radius: 18, hp: 88, speed: 108, damage: 16, damageElement: "cold", xp: 28, gold: 16, color: "#9be7ff", resists: { cold: 0.35, fire: 1.7, dark: 1.1 } },
      dreamling: { name: "Dreamling", family: "dream", radius: 16, hp: 72, speed: 132, damage: 13, damageElement: "arcane", xp: 24, gold: 14, color: "#d58cff", resists: { arcane: 0.48, holy: 1.25, dark: 0.72 } },
      nightmare: { name: "Nightmare Brute", family: "dream", radius: 24, hp: 136, speed: 102, damage: 20, damageElement: "dark", xp: 36, gold: 20, color: "#5a00ff", resists: { dark: 0.42, holy: 1.7, arcane: 0.7 } },
      wraithling: { name: "Wandering Wraith", family: "undead", radius: 18, hp: 86, speed: 132, damage: 15, damageElement: "dark", xp: 28, gold: 13, color: "#c4a5ff", resists: { physical: 0.55, dark: 0.38, holy: 1.9 } },
      demonHound: { name: "Demon Hound", family: "demon", radius: 18, hp: 96, speed: 152, damage: 17, damageElement: "fire", xp: 30, gold: 16, color: "#c14545", resists: { fire: 0.35, holy: 1.6, dark: 0.65 } },
      demonKnight: { name: "Demon Knight", family: "demon", radius: 23, hp: 156, speed: 104, damage: 24, damageElement: "dark", xp: 44, gold: 24, color: "#8b1f3a", resists: { dark: 0.35, holy: 1.85, physical: 0.78 } },
      voidPriest: { name: "Void Priest", family: "demon", radius: 19, hp: 116, speed: 112, damage: 20, damageElement: "arcane", xp: 38, gold: 22, color: "#7b54ff", resists: { arcane: 0.42, holy: 1.55, lightning: 1.2 } },
      lich: { name: "Lich", family: "undead", radius: 36, hp: 780, speed: 78, damage: 30, damageElement: "dark", xp: 180, gold: 110, color: "#c4a5ff", boss: true, resists: { dark: 0.25, holy: 2.0, fire: 1.25, physical: 0.82 } },
      dragon: { name: "Dragon", family: "dragon", radius: 48, hp: 1250, speed: 76, damage: 40, damageElement: "fire", xp: 260, gold: 170, color: "#ff6a3d", boss: true, resists: { fire: 0.22, water: 1.7, cold: 1.35, physical: 0.78 } },
      chimera: { name: "Chimera", family: "beast", radius: 42, hp: 1450, speed: 104, damage: 42, damageElement: "physical", xp: 300, gold: 190, color: "#c28bff", boss: true, resists: { physical: 0.7, fire: 0.75, lightning: 1.25, holy: 1.15 } },
      slimeTitan: { name: "Giant Slime Monster", family: "slime", radius: 52, hp: 1650, speed: 64, damage: 36, damageElement: "poison", xp: 330, gold: 210, color: "#6dffb2", boss: true, resists: { poison: 0.2, fire: 1.55, lightning: 1.25, physical: 0.62 } },
      spiderQueen: { name: "Arachne Spider Queen", family: "beast", radius: 46, hp: 1850, speed: 104, damage: 45, damageElement: "poison", xp: 360, gold: 230, color: "#923fc4", boss: true, resists: { poison: 0.2, fire: 1.75, nature: 0.42, holy: 1.1 } },
      genie: { name: "Genie", family: "desert", radius: 43, hp: 2050, speed: 118, damage: 48, damageElement: "arcane", xp: 390, gold: 260, color: "#77a8ff", boss: true, resists: { arcane: 0.35, earth: 1.35, lightning: 0.7, dark: 1.2 } },
      yeti: { name: "Yeti", family: "beast", radius: 50, hp: 2300, speed: 86, damage: 54, damageElement: "cold", xp: 430, gold: 290, color: "#e8fbff", boss: true, resists: { cold: 0.18, fire: 1.9, physical: 0.72 } },
      wraith: { name: "Wraith", family: "undead", radius: 44, hp: 2550, speed: 128, damage: 58, damageElement: "dark", xp: 470, gold: 320, color: "#a335ee", boss: true, resists: { physical: 0.45, dark: 0.18, holy: 2.1, arcane: 0.62 } },
      shardGuardian: { name: "Shard Guardian", family: "construct", radius: 48, hp: 2850, speed: 82, damage: 62, damageElement: "earth", xp: 520, gold: 360, color: "#e6cc80", boss: true, resists: { earth: 0.2, lightning: 1.55, physical: 0.65 } },
      runestoneSentinel: { name: "Runestone Sentinel", family: "construct", radius: 52, hp: 3200, speed: 78, damage: 68, damageElement: "holy", xp: 600, gold: 410, color: "#9df7a4", boss: true, resists: { holy: 0.25, dark: 1.6, physical: 0.68, arcane: 1.2 } },
      demonGodKing: { name: "Demon God King", family: "demon", radius: 62, hp: 5200, speed: 96, damage: 88, damageElement: "dark", xp: 1200, gold: 1000, color: "#ff335f", boss: true, resists: { dark: 0.18, fire: 0.42, holy: 2.2, physical: 0.72, arcane: 0.58 } }
    };

    const REALM_BLUEPRINTS = [
      { id: "graveyard", name: "Graveyard Realm", title: "Realm of the Restless Dead", detail: "Undead graveyards, crypt paths, lich rites, and bone-packed lanes.", theme: "graveyard", color: "#d9d3c2", floorCount: 5, bossType: "lich", enemyPool: ["zombie", "skeleton", "ghoul"], elitePool: ["cultist", "wraithling"], anchorHp: 145, enemyCap: 42, spawnEvery: 3.5 },
      { id: "mountains", name: "Mountain Realm", title: "Realm of Crags and Monsters", detail: "Rocky climbs with goblins, orcs, trolls, crag beasts, and the dragon's peak.", theme: "mountain", color: "#a68d66", floorCount: 5, bossType: "dragon", enemyPool: ["goblin", "orc", "mountainBeast"], elitePool: ["troll", "fireImp"], anchorHp: 175, enemyCap: 46, spawnEvery: 3.35 },
      { id: "castle", name: "Castle Realm", title: "Realm of Broken Keeps", detail: "Armored halls, gargoyles, dark cultists, and a chimera in the inner keep.", theme: "castle", color: "#9c80ff", floorCount: 5, bossType: "chimera", enemyPool: ["castleKnight", "skeleton", "cultist"], elitePool: ["gargoyle", "orc"], anchorHp: 205, enemyCap: 48, spawnEvery: 3.2 },
      { id: "skyships", name: "Skyship Realm", title: "Realm of Storm Rigging", detail: "Floating decks, sky raiders, storm harpies, and a giant slime monster below the hulls.", theme: "skyship", color: "#77a8ff", floorCount: 5, bossType: "slimeTitan", enemyPool: ["skyRaider", "stormHarpy", "gargoyle"], elitePool: ["fireImp", "cultist"], anchorHp: 230, enemyCap: 50, spawnEvery: 3.05 },
      { id: "forest", name: "Forest Realm", title: "Realm of Tangled Hunts", detail: "Forest trolls, venom spiders, old growth ambushes, and Arachne's nest.", theme: "forest", color: "#63f0c4", floorCount: 5, bossType: "spiderQueen", enemyPool: ["forestSpider", "forestTroll", "goblin"], elitePool: ["troll", "orc"], anchorHp: 255, enemyCap: 52, spawnEvery: 2.95 },
      { id: "desertTemple", name: "Desert Temple Realm", title: "Realm of Sunken Kings", detail: "Temple courts with jackal guards, sand priests, scarabs, and a genie seal.", theme: "desert", color: "#e6cc80", floorCount: 5, bossType: "genie", enemyPool: ["anubisGuard", "sandPriest", "scarab"], elitePool: ["cultist", "gargoyle"], anchorHp: 285, enemyCap: 54, spawnEvery: 2.85 },
      { id: "ice", name: "Ice Realm", title: "Realm of Frozen Teeth", detail: "Ice wolves, frost bears, witches, polar pressure, and the yeti's frozen cave.", theme: "ice", color: "#9be7ff", floorCount: 5, bossType: "yeti", enemyPool: ["iceWolf", "polarBear", "frostWitch"], elitePool: ["skeleton", "wraithling"], anchorHp: 315, enemyCap: 56, spawnEvery: 2.75 },
      { id: "dream", name: "Dream Realm", title: "Realm of Unstable Thought", detail: "Strange colors, nightmares, wraiths, and rules that feel slightly wrong.", theme: "dream", color: "#d58cff", floorCount: 5, bossType: "wraith", enemyPool: ["dreamling", "nightmare", "wraithling"], elitePool: ["cultist", "gargoyle"], anchorHp: 350, enemyCap: 58, spawnEvery: 2.65 },
      { id: "bossShard", name: "Boss Shard Level", title: "Shard of the Eight", detail: "A single guardian level that binds the conquered boss shards.", theme: "shard", color: "#e6cc80", floorCount: 1, bossType: "shardGuardian", enemyPool: ["gargoyle", "castleKnight", "voidPriest"], elitePool: ["demonKnight"], anchorHp: 420, enemyCap: 52, spawnEvery: 2.55 },
      { id: "runestone", name: "Runestone Level", title: "Runestone Trial", detail: "A focused trial around the last runestone seal.", theme: "runestone", color: "#9df7a4", floorCount: 1, bossType: "runestoneSentinel", enemyPool: ["anubisGuard", "frostWitch", "skyRaider"], elitePool: ["voidPriest"], anchorHp: 455, enemyCap: 54, spawnEvery: 2.45 },
      { id: "demonMarch", name: "Demon Gate Realm", title: "Three Roads to the Throne", detail: "Three brutal approach levels before the final boss fight.", theme: "demon", color: "#ff668a", floorCount: 3, enemyPool: ["demonHound", "demonKnight", "voidPriest"], elitePool: ["nightmare", "cultist"], anchorHp: 500, enemyCap: 64, spawnEvery: 2.25 },
      { id: "finalDemon", name: "Demon God King's Realm", title: "Final Boss Fight", detail: "The last throne room and the Demon God King.", theme: "final", color: "#ff335f", floorCount: 1, bossType: "demonGodKing", enemyPool: ["demonHound", "demonKnight", "voidPriest"], elitePool: ["nightmare"], anchorHp: 620, enemyCap: 60, spawnEvery: 2.15 }
    ];

    const FLOOR_DEFS = buildRealmFloors(REALM_BLUEPRINTS);
    const REALM_DEFS = REALM_BLUEPRINTS.map((realm) => ({
      id: realm.id,
      floor: realm.floor,
      floorCount: realm.floorCount,
      name: realm.name,
      title: realm.title,
      detail: realm.detail,
      color: realm.color
    }));
    const MAIN_REALM_IDS = REALM_BLUEPRINTS.slice(0, 8).map((realm) => realm.id);
    const HUB_LEVEL_PORTALS = buildHubLevelPortals(FLOOR_DEFS, REALM_DEFS);
    const HUB_REALM_LABELS = buildHubRealmLabels(HUB_LEVEL_PORTALS);
    const USABLE_AUDIO_ROOT = "/assets/audio/riftwarden";
    const MUSIC_VOLUME = 0.22;
    const SFX_VOLUME = 0.38;
    const MUSIC_TRACKS = {
      epic: [
        "music/epic/castle-1.mp3",
        "music/epic/castle-3.mp3",
        "music/epic/castle-boss-chimeras-keep.mp3",
        "music/epic/gauntlet-legends-2001.mp3",
        "music/epic/gauntlet-legends.mp3",
        "music/epic/mausoleum.mp3",
        "music/epic/mountain-level.mp3"
      ],
      spooky: [
        "music/spooky/ghost-town.mp3",
        "music/spooky/graveyard-3.mp3",
        "music/spooky/graveyard-boss.mp3",
        "music/spooky/haunted-cemetery.mp3",
        "music/spooky/poison-fields.mp3",
        "music/spooky/skorne-battle.mp3"
      ],
      neither: [
        "music/neutral/abandoned-beacon-n64.mp3",
        "music/neutral/ravaged-acres.mp3",
        "music/neutral/venomous-spire-1.mp3"
      ],
      dream: [
        "music/dream/dream-hub.mp3",
        "music/dream/dream-shop-x4.mp3",
        "music/dream/organ-2.wav"
      ],
      special: [
        "music/special/ghost-piano-16bit.wav",
        "music/special/ghost-town-piano-x4.mp3",
        "music/special/n64-main-screen.mp3",
        "music/special/secret-crop-circles.mp3"
      ],
      hub: ["music/hub/sumners-tower-acoustic.mp3"],
      finalBoss: ["music/boss/final-boss.mp3"],
      levelLoadRare: ["music/stingers/level-load-rare.mp3"],
      bossClearOnce: ["music/stingers/realm-boss-clear-once.mp3"],
      demonApproachRare: ["music/stingers/demon-approach-rare.mp3"]
    };
    const REALM_MUSIC_STYLES = {
      graveyard: ["spooky"],
      mountains: ["epic"],
      castle: ["epic"],
      skyships: ["neither"],
      forest: ["neither"],
      desertTemple: ["epic", "neither"],
      ice: ["epic", "neither"],
      dream: ["spooky", "dream"],
      bossShard: ["epic", "spooky"],
      runestone: ["epic", "neither"],
      demonMarch: ["epic", "spooky"],
      finalDemon: ["finalBoss"]
    };
    const BOSS_CLEAR_STINGER_REALMS = new Set(["mountains", "castle", "skyships", "forest", "desertTemple", "ice"]);
    const SFX_TRACKS = {
      pickup: "sfx/ui/pickup.wav",
      portal: "sfx/ui/teleporter.wav",
      quest: "sfx/ui/key-or-quest.wav",
      death: "sfx/boss/death-dying.wav",
      halo: "sfx/ui/halo-secret.wav",
      lich: "sfx/boss/lich-ability-voice.wav",
      laserLoop: "sfx/spells/laser-ray-loop.wav",
      wraith: [
        "sfx/boss/shadow-wraith/wraat11b.wav",
        "sfx/boss/shadow-wraith/wraat8b.wav",
        "sfx/boss/shadow-wraith/wraatk02.wav",
        "sfx/boss/shadow-wraith/wraatk03.wav",
        "sfx/boss/shadow-wraith/wraatk04.wav",
        "sfx/boss/shadow-wraith/wraatk05.wav",
        "sfx/boss/shadow-wraith/wraatk09.wav",
        "sfx/boss/shadow-wraith/wraatk10.wav",
        "sfx/boss/shadow-wraith/wraatk7b.wav",
        "sfx/boss/shadow-wraith/wradth2.wav",
        "sfx/boss/shadow-wraith/wraent.wav",
        "sfx/boss/shadow-wraith/wrapn5.wav"
      ]
    };

    function buildHubLevelPortals(floors, realms) {
      const clusterPoints = {
        graveyard: [[16, 7], [17, 5.5], [18.5, 5], [20, 5.5], [21, 7]],
        mountains: [[39, 7], [38, 5.5], [36.5, 5], [35, 5.5], [34, 7]],
        castle: [[4.75, 19], [3.75, 18], [3.25, 17], [3.75, 16], [4.75, 15]],
        skyships: [[4.75, 29], [4, 28], [3.5, 27], [4, 26], [4.75, 25]],
        forest: [[5.5, 38], [4.5, 37], [4, 36], [4.5, 35], [5.5, 34]],
        desertTemple: [[50.25, 19], [51.25, 18], [51.75, 17], [51.25, 16], [50.25, 15]],
        ice: [[50.25, 29], [51, 28], [51.5, 27], [51, 26], [50.25, 25]],
        dream: [[49.5, 38], [50.5, 37], [51, 36], [50.5, 35], [49.5, 34]],
        bossShard: [[28, 13.5]],
        runestone: [[28, 23.5]],
        demonMarch: [[25.5, 32], [28, 33], [30.5, 32]],
        finalDemon: [[28, 30]]
      };
      return floors.map((floor) => {
        const realm = realms.find((entry) => entry.id === floor.realmId);
        const points = clusterPoints[floor.realmId] || [[28, 20]];
        const point = points[Math.min(floor.stage - 1, points.length - 1)];
        return {
          id: `${floor.realmId}-${floor.stage}`,
          floorNumber: floor.floorNumber,
          realmId: floor.realmId,
          realmName: floor.realmName,
          stage: floor.stage,
          stageCount: floor.stageCount,
          bossStage: floor.bossStage,
          name: floor.name,
          color: floor.color || realm?.color || "#f7cc78",
          x: TILE * point[0],
          y: TILE * point[1],
          radius: floor.bossStage ? 34 : 28
        };
      });
    }

    function buildHubRealmLabels(portals) {
      const groups = new Map();
      for (const portal of portals) {
        if (!groups.has(portal.realmId)) {
          groups.set(portal.realmId, []);
        }
        groups.get(portal.realmId).push(portal);
      }
      return Array.from(groups.entries()).map(([realmId, group]) => {
        const x = group.reduce((sum, portal) => sum + portal.x, 0) / group.length;
        const y = group.reduce((sum, portal) => sum + portal.y, 0) / group.length;
        return {
          realmId,
          text: group[0].realmName.replace(" Realm", "").toUpperCase(),
          color: group[0].color,
          x,
          y: y - TILE * 1.15
        };
      });
    }

    function buildRealmFloors(realms) {
      const floors = [];
      let nextFloor = 1;
      for (const realm of realms) {
        realm.floor = nextFloor;
        for (let stage = 1; stage <= realm.floorCount; stage += 1) {
          const bossStage = Boolean(realm.bossType && stage === realm.floorCount);
          const floorIndex = nextFloor - 1;
          const activePool = stage >= 3 ? [...realm.enemyPool, ...(realm.elitePool || [])] : [...realm.enemyPool];
          const bossName = bossStage ? ENEMY_DEFS[realm.bossType]?.name || "Boss" : "";
          floors.push({
            floorNumber: nextFloor,
            realmId: realm.id,
            realmName: realm.name,
            stage,
            stageCount: realm.floorCount,
            bossStage,
            bossType: bossStage ? realm.bossType : "",
            theme: realm.theme,
            color: realm.color,
            name: bossStage ? `${realm.name}: ${bossName}` : `${realm.name} ${stage}`,
            objective: bossStage ? `Defeat ${bossName} and break the seals.` : "Break the rift anchors, then find the exit portal.",
            anchorHp: Math.round(realm.anchorHp * (1 + floorIndex * 0.055 + stage * 0.12)),
            enemyCap: realm.enemyCap + stage * 5 + Math.floor(floorIndex * 0.25),
            spawnEvery: Math.max(1.35, realm.spawnEvery - stage * 0.16 - floorIndex * 0.01),
            anchorTypes: [...activePool],
            startEnemies: makeStageStartEnemies(activePool, stage, realm.bossType, bossStage),
            anchors: makeStageAnchors(bossStage ? 2 + Math.min(2, Math.floor(stage / 2)) : 4 + Math.min(3, Math.floor(stage / 2))),
            exitPortal: { x: TILE * 51.5, y: TILE * 36, radius: 58 }
          });
          nextFloor += 1;
        }
      }
      return floors;
    }

    function makeStageStartEnemies(types, stage, bossType, bossStage) {
      const points = [
        [10, 7], [16, 10], [24, 8], [33, 10], [43, 8], [49, 15],
        [12, 20], [22, 19], [34, 20], [46, 23], [10, 31], [19, 34],
        [31, 32], [42, 34], [49, 31], [28, 27], [39, 15], [18, 25]
      ];
      const count = bossStage ? 10 + stage * 2 : 13 + stage * 5;
      const enemies = [];
      for (let index = 0; index < count; index += 1) {
        const point = points[index % points.length];
        const type = types[index % types.length];
        enemies.push([type, point[0] + (index % 3) - 1, point[1] + Math.floor(index / points.length)]);
      }
      if (bossStage && bossType) {
        enemies.push([bossType, 45, 31]);
      }
      return enemies;
    }

    function makeStageAnchors(count) {
      const points = [
        [14, 9], [30, 8], [45, 12], [12, 24],
        [28, 22], [44, 27], [20, 34], [38, 35]
      ];
      return points.slice(0, count);
    }

    const SHOP_ITEMS = [
      {
        id: "health",
        label: "Health Tonic",
        cost: 22,
        detail: "Restore 55 health.",
        buy() {
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + 55);
          addEffect(state.player.x, state.player.y - 26, "+55 HP", "#ff668a");
        }
      },
      {
        id: "training",
        label: "Training Manual",
        cost: 48,
        detail: "Gain 1 spendable stat point.",
        buy() {
          if (grantStatPoint()) {
            addEffect(state.player.x, state.player.y - 26, "+1 Stat Point", "#f7cc78");
          }
        }
      }
    ];

    const QUEST_DEFS = [
      {
        id: "anchors",
        name: "Seal the First Tears",
        target: 3,
        detail: "Clear 3 rift anchors.",
        reward: "45 gold, 35 XP, +1 stat point",
        progress() {
          return state.quests.anchorsCleared;
        },
        claim() {
          state.gold += 45;
          gainXp(35);
          grantStatPoint();
        }
      },
      {
        id: "samples",
        name: "Bring Back Rift Spoils",
        target: 12,
        detail: "Defeat 12 enemies for the market scout.",
        reward: "32 gold, 40 XP, +1 stat point",
        progress() {
          return state.quests.kills;
        },
        claim() {
          state.gold += 32;
          gainXp(40);
          grantStatPoint();
        }
      }
    ];

    const keys = new Set();
    const mouse = { x: 0, y: 0, down: false, pressed: false, altDirect: false };
    const GAMEPAD_DEADZONE = 0.18;
    const GAMEPAD_TRIGGER = 0.35;
    const GAMEPAD_BUTTON = {
      A: 0,
      B: 1,
      X: 2,
      Y: 3,
      LB: 4,
      RB: 5,
      LT: 6,
      RT: 7,
      UP: 12,
      DOWN: 13,
      LEFT: 14,
      RIGHT: 15
    };
    const gamepadInput = {
      index: null,
      connected: false,
      buttons: [],
      prevButtons: [],
      buttonValues: [],
      moveX: 0,
      moveY: 0,
      aimX: 1,
      aimY: 0,
      aimAngle: 0,
      aimActive: false,
      prevAimActive: false
    };
    const blocked = new Set();
    let lastTick = 0;
    let lastShopMarkup = "";
    let lastQuestMarkup = "";
    let aimSource = "mouse";

    const state = {
      running: false,
      screen: "select",
      selectedClassKey: "warrior",
      heroName: DEFAULT_HERO_NAME,
      classKey: "warrior",
      nameOverrideClass: null,
      realmKey: "graveyard",
      floor: 1,
      floorClear: false,
      elapsed: 0,
      camera: { x: 0, y: 0 },
      player: null,
      enemies: [],
      projectiles: [],
      pickups: [],
      effects: [],
      anchors: [],
      hazards: [],
      gold: 0,
      xp: 0,
      xpToNext: 30,
      nearShop: true,
      sageQueue: [],
      sageChannel: null,
      sageMessage: "",
      rainTimer: 0,
      rainTickTimer: 0,
      timeWarpTimer: 0,
      meteorShowers: [],
      hubPortalCooldown: 0,
      realmsCleared: {},
      realmProgress: {},
      audioOnce: {},
      quests: {
        kills: 0,
        anchorsCleared: 0,
        claimed: {}
      },
      shopPurchases: 0
    };
    const audioState = {
      unlocked: false,
      currentMusic: null,
      currentMusicKey: "",
      pendingContext: null,
      lastTrackByContext: new Map(),
      recentSfx: new Map(),
      activeLoops: new Map()
    };

    function normalizeHeroName(name) {
      return name.trim().toLowerCase();
    }

    function getSecretClassForName(name) {
      return SECRET_NAME_CLASSES[normalizeHeroName(name)] || null;
    }

    function getCurrentRealmDef() {
      return REALM_DEFS.find((realm) => realm.id === state.realmKey) || REALM_DEFS[0];
    }

    function usableAudioUrl(relativePath) {
      return `${USABLE_AUDIO_ROOT}/${relativePath.split("/").map((segment) => encodeURIComponent(segment)).join("/")}`;
    }

    function pickRandom(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    function pickAvoidingImmediateRepeat(list, contextKey) {
      if (!list.length) {
        return "";
      }
      if (list.length === 1) {
        audioState.lastTrackByContext.set(contextKey, list[0]);
        return list[0];
      }
      const lastTrack = audioState.lastTrackByContext.get(contextKey);
      const candidates = list.filter((track) => track !== lastTrack);
      const track = pickRandom(candidates.length ? candidates : list);
      audioState.lastTrackByContext.set(contextKey, track);
      return track;
    }

    function createAudio(relativePath, volume = MUSIC_VOLUME, loop = false) {
      const audio = new Audio(usableAudioUrl(relativePath));
      audio.preload = "auto";
      audio.volume = volume;
      audio.loop = loop;
      return audio;
    }

    function playAudioElement(audio) {
      const playPromise = audio.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    }

    function unlockAudio() {
      if (audioState.unlocked) {
        return;
      }
      audioState.unlocked = true;
      if (audioState.pendingContext) {
        playContextMusic(audioState.pendingContext);
      }
    }

    function stopMusic() {
      if (audioState.currentMusic) {
        audioState.currentMusic.pause();
        audioState.currentMusic.src = "";
      }
      audioState.currentMusic = null;
      audioState.currentMusicKey = "";
    }

    function playMusic(relativePath, options = {}) {
      if (!relativePath) {
        return;
      }
      if (!audioState.unlocked) {
        return;
      }
      const key = options.key || relativePath;
      if (audioState.currentMusicKey === key && audioState.currentMusic && !audioState.currentMusic.paused) {
        return;
      }
      stopMusic();
      const audio = createAudio(relativePath, options.volume ?? MUSIC_VOLUME, options.loop ?? true);
      audioState.currentMusic = audio;
      audioState.currentMusicKey = key;
      if (options.resumeContextOnEnd) {
        audio.addEventListener("ended", () => {
          if (audioState.currentMusic === audio && audioState.pendingContext) {
            playContextMusic(audioState.pendingContext);
          }
        }, { once: true });
      }
      playAudioElement(audio);
    }

    function playStinger(relativePath, options = {}) {
      if (!audioState.unlocked || !relativePath) {
        return;
      }
      const audio = createAudio(relativePath, options.volume ?? 0.18, false);
      playAudioElement(audio);
    }

    function collectMusicTracks(styleKeys) {
      const tracks = [];
      for (const styleKey of styleKeys) {
        tracks.push(...(MUSIC_TRACKS[styleKey] || []));
      }
      return tracks;
    }

    function getFloorMusicTrack(floorDef) {
      if (floorDef.realmId === "finalDemon") {
        return pickAvoidingImmediateRepeat(MUSIC_TRACKS.finalBoss, "final-boss");
      }
      if (floorDef.realmId === "demonMarch" && !floorDef.bossStage && Math.random() < 0.08) {
        return MUSIC_TRACKS.demonApproachRare[0];
      }
      if (!floorDef.bossStage && Math.random() < 0.012) {
        const availableSpecials = MUSIC_TRACKS.special.filter((track) => !state.audioOnce[`special:${track}`]);
        const special = pickRandom(availableSpecials);
        if (special) {
          state.audioOnce[`special:${special}`] = true;
          return special;
        }
      }
      const styleKeys = REALM_MUSIC_STYLES[floorDef.realmId] || ["epic"];
      const tracks = collectMusicTracks(styleKeys);
      return pickAvoidingImmediateRepeat(tracks, floorDef.realmId);
    }

    function playContextMusic(context) {
      audioState.pendingContext = context;
      if (!audioState.unlocked) {
        return;
      }
      if (context.screen === "select") {
        stopMusic();
        return;
      }
      if (context.screen === "hub") {
        playMusic(MUSIC_TRACKS.hub[0], { key: "hub", loop: true });
        return;
      }
      if (context.floorDef) {
        playMusic(getFloorMusicTrack(context.floorDef), { key: `floor:${context.floorDef.floorNumber}`, loop: true });
      }
    }

    function playLevelLoadStinger(floorDef) {
      if (!floorDef.bossStage && Math.random() < 0.12) {
        playStinger(MUSIC_TRACKS.levelLoadRare[0], { volume: 0.13 });
      }
    }

    function playBossClearStinger(floorDef) {
      if (!floorDef.bossStage || !BOSS_CLEAR_STINGER_REALMS.has(floorDef.realmId)) {
        return;
      }
      const key = `boss-clear:${floorDef.realmId}`;
      if (state.audioOnce[key]) {
        return;
      }
      state.audioOnce[key] = true;
      playStinger(MUSIC_TRACKS.bossClearOnce[0], { volume: 0.2 });
    }

    function playBossIntroSfx(floorDef) {
      if (!floorDef.bossStage) {
        return;
      }
      if (floorDef.bossType === "lich") {
        playSfx("lich", { volume: 0.34, throttle: 8 });
      } else if (floorDef.bossType === "wraith") {
        playSfx("wraith", { volume: 0.34, throttle: 8 });
      } else if (floorDef.realmId === "finalDemon") {
        playSfx("death", { volume: 0.32, throttle: 8 });
      }
    }

    function playSecretHeroStinger(classKey) {
      if (classKey === "sage") {
        playStinger("music/special/secret-crop-circles.mp3", { volume: 0.18 });
        playSfx("halo", { volume: 0.28, throttle: 2 });
      } else if (classKey === "pojo") {
        playSfx("halo", { volume: 0.24, throttle: 2 });
      }
    }

    function playSfx(key, options = {}) {
      if (!audioState.unlocked) {
        return;
      }
      const now = performance.now() / 1000;
      const throttle = options.throttle ?? 0.06;
      const recent = audioState.recentSfx.get(key) || 0;
      if (now - recent < throttle) {
        return;
      }
      const entry = SFX_TRACKS[key];
      const relativePath = Array.isArray(entry) ? pickRandom(entry) : entry;
      if (!relativePath) {
        return;
      }
      audioState.recentSfx.set(key, now);
      const audio = createAudio(relativePath, options.volume ?? SFX_VOLUME, false);
      playAudioElement(audio);
    }

    function startSfxLoop(key, relativePath, volume = 0.16) {
      if (!audioState.unlocked || audioState.activeLoops.has(key)) {
        return;
      }
      const audio = createAudio(relativePath, volume, true);
      audioState.activeLoops.set(key, audio);
      playAudioElement(audio);
    }

    function stopSfxLoop(key) {
      const audio = audioState.activeLoops.get(key);
      if (!audio) {
        return;
      }
      audio.pause();
      audio.src = "";
      audioState.activeLoops.delete(key);
    }

    function hideScreens() {
      characterSelect.hidden = true;
    }

    function renderCharacterSelect() {
      for (const button of characterClassButtons) {
        const classKey = button.dataset.selectClass;
        button.classList.toggle("is-active", classKey === state.selectedClassKey);
      }
    }

    function setSelectedClass(classKey, message = "") {
      if (!CLASS_DEFS[classKey]) {
        return;
      }
      if (CLASS_DEFS[classKey].secret) {
        secretNameHint.textContent = "Hidden heroes answer only to their name when you enter the hub.";
        return;
      }
      state.selectedClassKey = classKey;
      secretNameHint.textContent = message || "Choose a hero, then enter the realm hub.";
      renderCharacterSelect();
    }

    function syncSecretNameSelection() {
      const secretClass = getSecretClassForName(characterNameInput.value);
      if (!secretClass) {
        secretNameHint.textContent = "Secret names override your chosen hero when you enter the hub.";
        renderCharacterSelect();
        return null;
      }
      secretNameHint.textContent = `${characterNameInput.value.trim()} will enter as ${CLASS_DEFS[secretClass].name}, no matter which hero is highlighted.`;
      renderCharacterSelect();
      return secretClass;
    }

    function openCharacterSelect() {
      state.screen = "select";
      state.running = false;
      mouse.down = false;
      stopSageChannel();
      playContextMusic({ screen: "select" });
      characterNameInput.value = state.heroName === DEFAULT_HERO_NAME ? "" : state.heroName;
      characterSelect.hidden = false;
      syncSecretNameSelection();
      renderClassButtons();
      setTimeout(() => characterNameInput.focus(), 0);
    }

    function openRealmHub() {
      state.screen = "hub";
      state.running = true;
      mouse.down = false;
      stopSageChannel();
      characterSelect.hidden = true;
      buildHubMap();
      if (!state.player) {
        createPlayer();
      }
      state.player.x = HUB_SPAWN.x;
      state.player.y = HUB_SPAWN.y;
      state.player.hp = state.player.maxHp;
      state.player.attackTimer = 0;
      state.player.skillTimer = 0;
      state.player.dashTimer = 0;
      state.player.dashCooldown = 0;
      state.hubPortalCooldown = 0.55;
      state.enemies = [];
      state.projectiles = [];
      state.pickups = [];
      state.anchors = [];
      state.hazards = [];
      state.nearShop = true;
      state.rainTimer = 0;
      state.rainTickTimer = 0;
      state.timeWarpTimer = 0;
      state.meteorShowers = [];
      state.player.invisible = false;
      state.player.performanceTimer = 0;
      addEffect(state.player.x, state.player.y - 28, "Realm Hub", "#f7cc78");
      state.camera.x = clamp(state.player.x - canvas.width / DPR * 0.5, 0, WORLD_W - canvas.width / DPR);
      state.camera.y = clamp(state.player.y - canvas.height / DPR * 0.5, 0, WORLD_H - canvas.height / DPR);
      playContextMusic({ screen: "hub" });
      lastTick = 0;
      renderClassButtons();
      updateHud();
    }

    function beginAdventure() {
      unlockAudio();
      const secretClass = syncSecretNameSelection();
      const classKey = secretClass || state.selectedClassKey;
      state.nameOverrideClass = secretClass;
      state.classKey = classKey;
      state.heroName = characterNameInput.value.trim() || CLASS_DEFS[classKey].name || DEFAULT_HERO_NAME;
      resetRunProgress();
      openRealmHub();
      if (secretClass) {
        playSecretHeroStinger(secretClass);
      }
    }

    function areMainRealmsCleared() {
      return MAIN_REALM_IDS.every((realmId) => state.realmsCleared[realmId]);
    }

    function isHubLevelPortalUnlocked(portal) {
      if (portal.realmId === "bossShard") {
        return areMainRealmsCleared();
      }
      if (portal.realmId === "runestone") {
        return Boolean(state.realmsCleared.bossShard);
      }
      if (portal.realmId === "demonMarch") {
        return Boolean(state.realmsCleared.runestone) && portal.stage <= (state.realmProgress.demonMarch || 1);
      }
      if (portal.realmId === "finalDemon") {
        return Boolean(state.realmsCleared.demonMarch);
      }
      return portal.stage <= (state.realmProgress[portal.realmId] || 1);
    }

    function isHubLevelPortalCleared(portal) {
      return Boolean(state.realmsCleared[portal.realmId]) || portal.stage < (state.realmProgress[portal.realmId] || 1);
    }

    function enterHubLevelPortal(portal) {
      if (!isHubLevelPortalUnlocked(portal)) {
        addEffect(state.player.x, state.player.y - 28, "Portal Locked", "#c2b8d8");
        state.hubPortalCooldown = 0.65;
        return;
      }
      state.realmKey = portal.realmId;
      hideScreens();
      state.screen = "play";
      state.running = true;
      state.hubPortalCooldown = 0;
      playSfx("portal", { volume: 0.34, throttle: 0.6 });
      startFloor(portal.floorNumber);
      updateHud();
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function distanceSquared(x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return dx * dx + dy * dy;
    }

    function applyDeadzone(value) {
      return Math.abs(value) >= GAMEPAD_DEADZONE ? value : 0;
    }

    function readGamepadStick(gamepad, xIndex, yIndex) {
      const rawX = gamepad.axes[xIndex] || 0;
      const rawY = gamepad.axes[yIndex] || 0;
      const length = Math.hypot(rawX, rawY);
      if (length < GAMEPAD_DEADZONE) {
        return { x: 0, y: 0, active: false };
      }
      const scale = Math.min(1, (length - GAMEPAD_DEADZONE) / (1 - GAMEPAD_DEADZONE));
      return {
        x: (rawX / length) * scale,
        y: (rawY / length) * scale,
        active: true
      };
    }

    function pollGamepad() {
      const gamepads = navigator.getGamepads ? Array.from(navigator.getGamepads()) : [];
      const current = gamepadInput.index == null ? null : gamepads[gamepadInput.index];
      const gamepad = current?.connected ? current : gamepads.find((pad) => pad?.connected);
      if (!gamepad) {
        gamepadInput.connected = false;
        gamepadInput.index = null;
        gamepadInput.buttons = [];
        gamepadInput.buttonValues = [];
        gamepadInput.moveX = 0;
        gamepadInput.moveY = 0;
        gamepadInput.aimActive = false;
        return;
      }

      gamepadInput.connected = true;
      gamepadInput.index = gamepad.index;
      gamepadInput.buttonValues = gamepad.buttons.map((button) => button.value || 0);
      gamepadInput.buttons = gamepad.buttons.map((button) => button.pressed || button.value >= GAMEPAD_TRIGGER);

      const move = readGamepadStick(gamepad, 0, 1);
      const aim = readGamepadStick(gamepad, 2, 3);
      gamepadInput.moveX = applyDeadzone(move.x);
      gamepadInput.moveY = applyDeadzone(move.y);
      if (gamepadButtonDown(GAMEPAD_BUTTON.LEFT)) gamepadInput.moveX -= 1;
      if (gamepadButtonDown(GAMEPAD_BUTTON.RIGHT)) gamepadInput.moveX += 1;
      if (gamepadButtonDown(GAMEPAD_BUTTON.UP)) gamepadInput.moveY -= 1;
      if (gamepadButtonDown(GAMEPAD_BUTTON.DOWN)) gamepadInput.moveY += 1;
      const moveLength = Math.hypot(gamepadInput.moveX, gamepadInput.moveY);
      if (moveLength > 1) {
        gamepadInput.moveX /= moveLength;
        gamepadInput.moveY /= moveLength;
      }

      gamepadInput.aimActive = aim.active;
      if (aim.active) {
        gamepadInput.aimX = aim.x;
        gamepadInput.aimY = aim.y;
        gamepadInput.aimAngle = Math.atan2(aim.y, aim.x);
        aimSource = "gamepad";
      }
    }

    function gamepadButtonDown(buttonIndex) {
      return Boolean(gamepadInput.connected && gamepadInput.buttons[buttonIndex]);
    }

    function gamepadButtonPressed(buttonIndex) {
      return Boolean(gamepadButtonDown(buttonIndex) && !gamepadInput.prevButtons[buttonIndex]);
    }

    function finishInputFrame() {
      mouse.pressed = false;
      gamepadInput.prevButtons = [...gamepadInput.buttons];
      gamepadInput.prevAimActive = gamepadInput.connected && gamepadInput.aimActive;
    }

    function getMoveVector() {
      let mx = 0;
      let my = 0;
      if (keys.has("w") || keys.has("ArrowUp")) my -= 1;
      if (keys.has("s") || keys.has("ArrowDown")) my += 1;
      if (keys.has("a") || keys.has("ArrowLeft")) mx -= 1;
      if (keys.has("d") || keys.has("ArrowRight")) mx += 1;
      mx += gamepadInput.moveX;
      my += gamepadInput.moveY;
      const length = Math.hypot(mx, my);
      if (length > 1) {
        mx /= length;
        my /= length;
      }
      return { x: mx, y: my, active: Boolean(length) };
    }

    function tileKey(col, row) {
      return `${col},${row}`;
    }

    function isWall(col, row) {
      return col < 0 || row < 0 || col >= MAP_COLS || row >= MAP_ROWS || blocked.has(tileKey(col, row));
    }

    function addWall(col, row) {
      blocked.add(tileKey(col, row));
    }

    function buildMap() {
      const floorDef = getFloorDef();
      blocked.clear();
      for (let col = 0; col < MAP_COLS; col += 1) {
        addWall(col, 0);
        addWall(col, MAP_ROWS - 1);
      }
      for (let row = 0; row < MAP_ROWS; row += 1) {
        addWall(0, row);
        addWall(MAP_COLS - 1, row);
      }

      const rooms = [
        [8, 6, 10, 2], [23, 5, 2, 10], [35, 7, 12, 2],
        [10, 17, 2, 12], [19, 16, 11, 2], [36, 18, 2, 11],
        [45, 18, 8, 2], [7, 31, 12, 2], [25, 30, 14, 2],
        [47, 29, 2, 8], [15, 24, 2, 7], [31, 24, 9, 2]
      ];
      if (floorDef.stage >= 2) {
        rooms.push([5, 11, 2, 9], [49, 8, 2, 8], [20, 35, 18, 2]);
      }
      if (floorDef.stage >= 4 || floorDef.bossStage) {
        rooms.push([13, 12, 13, 2], [40, 13, 10, 2], [9, 25, 10, 2], [42, 34, 8, 2]);
      }
      if (["castle", "desert", "runestone", "final"].includes(floorDef.theme)) {
        rooms.push([27, 9, 2, 9], [27, 24, 2, 9], [17, 21, 18, 2]);
      }
      if (["forest", "graveyard", "dream"].includes(floorDef.theme)) {
        rooms.push([5, 36, 8, 2], [52, 20, 2, 11], [33, 12, 2, 7]);
      }
      if (["skyship", "ice", "mountain"].includes(floorDef.theme)) {
        rooms.push([14, 5, 2, 9], [40, 5, 2, 9], [22, 27, 2, 8], [43, 24, 2, 8]);
      }

      for (const [startCol, startRow, width, height] of rooms) {
        for (let col = startCol; col < startCol + width; col += 1) {
          for (let row = startRow; row < startRow + height; row += 1) {
            addWall(col, row);
          }
        }
      }

      const doorTiles = [
        [12, 6], [24, 8], [40, 7], [10, 23], [24, 16], [36, 23],
        [48, 18], [12, 31], [31, 30], [47, 33], [16, 27], [34, 24],
        [6, 15], [49, 12], [29, 21], [22, 35], [45, 34], [14, 8],
        [40, 8], [22, 30], [43, 28], [52, 25]
      ];
      doorTiles.forEach(([col, row]) => blocked.delete(tileKey(col, row)));
    }

    function buildHubMap() {
      blocked.clear();
      for (let row = 0; row < MAP_ROWS; row += 1) {
        const rowText = HUB_WALL_ROWS[row] || "";
        for (let col = 0; col < MAP_COLS; col += 1) {
          if (rowText[col] === "#") {
            addWall(col, row);
          }
        }
      }
      for (const portal of HUB_LEVEL_PORTALS) {
        clearHubPatch(portal.x, portal.y, 1);
      }
      clearHubPatch(HUB_SPAWN.x, HUB_SPAWN.y, 2);
      clearHubPatch(HUB_MARKET.x, HUB_MARKET.y, 2);
    }

    function clearHubPatch(worldX, worldY, radiusTiles = 1) {
      const centerCol = Math.round(worldX / TILE);
      const centerRow = Math.round(worldY / TILE);
      for (let col = centerCol - radiusTiles; col <= centerCol + radiusTiles; col += 1) {
        for (let row = centerRow - radiusTiles; row <= centerRow + radiusTiles; row += 1) {
          blocked.delete(tileKey(col, row));
        }
      }
    }

    function circleBlocked(x, y, radius) {
      const minCol = Math.floor((x - radius) / TILE);
      const maxCol = Math.floor((x + radius) / TILE);
      const minRow = Math.floor((y - radius) / TILE);
      const maxRow = Math.floor((y + radius) / TILE);

      for (let col = minCol; col <= maxCol; col += 1) {
        for (let row = minRow; row <= maxRow; row += 1) {
          if (!isWall(col, row)) {
            continue;
          }
          const left = col * TILE;
          const top = row * TILE;
          const closestX = clamp(x, left, left + TILE);
          const closestY = clamp(y, top, top + TILE);
          if (distanceSquared(x, y, closestX, closestY) < radius * radius) {
            return true;
          }
        }
      }
      return false;
    }

    function moveWithCollision(entity, dx, dy) {
      const nextX = clamp(entity.x + dx, entity.radius, WORLD_W - entity.radius);
      if (!circleBlocked(nextX, entity.y, entity.radius)) {
        entity.x = nextX;
      }

      const nextY = clamp(entity.y + dy, entity.radius, WORLD_H - entity.radius);
      if (!circleBlocked(entity.x, nextY, entity.radius)) {
        entity.y = nextY;
      }
    }

    function findOpenSpawnPoint(x, y, radius, minDistance = 0, maxDistance = 0) {
      const centerX = clamp(x, radius, WORLD_W - radius);
      const centerY = clamp(y, radius, WORLD_H - radius);
      if (minDistance <= 0 && maxDistance <= 0 && !circleBlocked(centerX, centerY, radius)) {
        return { x: centerX, y: centerY };
      }
      const player = state.player;
      for (let attempt = 0; attempt < 72; attempt += 1) {
        const angle = Math.random() * TAU;
        const distance = minDistance + Math.random() * Math.max(0, maxDistance - minDistance);
        const candidateX = clamp(centerX + Math.cos(angle) * distance, radius, WORLD_W - radius);
        const candidateY = clamp(centerY + Math.sin(angle) * distance, radius, WORLD_H - radius);
        if (circleBlocked(candidateX, candidateY, radius)) {
          continue;
        }
        if (player && distanceSquared(candidateX, candidateY, player.x, player.y) < (player.radius + radius + 34) ** 2) {
          continue;
        }
        return { x: candidateX, y: candidateY };
      }
      for (let ring = 1; ring <= 8; ring += 1) {
        const distance = Math.max(24, maxDistance || 48) + ring * 22;
        for (let step = 0; step < 16; step += 1) {
          const angle = (step / 16) * TAU;
          const candidateX = clamp(centerX + Math.cos(angle) * distance, radius, WORLD_W - radius);
          const candidateY = clamp(centerY + Math.sin(angle) * distance, radius, WORLD_H - radius);
          if (!circleBlocked(candidateX, candidateY, radius)) {
            return { x: candidateX, y: candidateY };
          }
        }
      }
      return null;
    }

    function screenToWorld(x, y) {
      return {
        x: state.camera.x + x,
        y: state.camera.y + y
      };
    }

    function worldToScreen(x, y) {
      return {
        x: x - state.camera.x,
        y: y - state.camera.y
      };
    }

    function getAimAngle() {
      if (gamepadInput.connected && aimSource === "gamepad") {
        return gamepadInput.aimAngle;
      }
      const target = screenToWorld(mouse.x, mouse.y);
      return Math.atan2(target.y - state.player.y, target.x - state.player.x);
    }

    function getSageTargetPoint(distance = 156, radius = 10) {
      const player = state.player;
      const angle = getAimAngle();
      for (let step = distance; step >= 36; step -= 16) {
        const x = clamp(player.x + Math.cos(angle) * step, player.radius, WORLD_W - player.radius);
        const y = clamp(player.y + Math.sin(angle) * step, player.radius, WORLD_H - player.radius);
        if (!circleBlocked(x, y, radius)) {
          return { x, y };
        }
      }
      return {
        x: clamp(player.x + Math.cos(angle) * 36, player.radius, WORLD_W - player.radius),
        y: clamp(player.y + Math.sin(angle) * 36, player.radius, WORLD_H - player.radius)
      };
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * DPR));
      canvas.height = Math.max(1, Math.round(rect.height * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function getClassDef() {
      return CLASS_DEFS[state.classKey] || CLASS_DEFS.warrior;
    }

    function getFloorDef() {
      return FLOOR_DEFS[Math.min(state.floor - 1, FLOOR_DEFS.length - 1)];
    }

    function getDerivedStats() {
      const classDef = getClassDef();
      const stats = state.player?.stats || classDef.stats;
      const level = state.player?.level || 1;
      const sage = state.classKey === "sage";
      const levelBonus = sage ? 0 : level;
      const classKey = state.classKey;
      let attackDamage;
      let techniqueDamage;
      if (classKey === "warrior") {
        attackDamage = 11 + stats.strength * 2.75 + stats.agility * 0.32 + levelBonus * 1.35;
        techniqueDamage = 14 + stats.strength * 3.1 + stats.agility * 0.25 + levelBonus * 1.5;
      } else if (classKey === "mage") {
        attackDamage = 8 + stats.intelligence * 2.55 + stats.agility * 0.25 + levelBonus * 1.25;
        techniqueDamage = 14 + stats.intelligence * 3.25 + stats.agility * 0.2 + levelBonus * 1.65;
      } else if (classKey === "archer") {
        attackDamage = 9 + stats.agility * 2.45 + stats.strength * 0.25 + levelBonus * 1.25;
        techniqueDamage = 12 + stats.agility * 2.95 + stats.strength * 0.2 + levelBonus * 1.45;
      } else if (classKey === "pojo") {
        attackDamage = 7 + stats.agility * 1.3 + stats.intelligence * 1.95 + levelBonus * 1.2;
        techniqueDamage = 12 + stats.intelligence * 2.55 + stats.agility * 1.1 + levelBonus * 1.45;
      } else {
        attackDamage = 8 + stats.intelligence * 1.8 + stats.agility * 0.45;
        techniqueDamage = 13 + stats.intelligence * 2.55 + stats.agility * 0.35;
      }
      const performanceBoost = state.player?.performanceTimer > 0 ? 1.55 : 1;
      return {
        maxHp: Math.round(classDef.baseHp + stats.strength * 10 + levelBonus * 8),
        speed: Math.round(classDef.baseSpeed + stats.agility * 5.5 + levelBonus * 1.35),
        weaponDamage: Math.round(attackDamage * performanceBoost),
        spellDamage: Math.round(techniqueDamage * performanceBoost),
        attackCooldown: Math.max(0.14, 0.4 - stats.agility * 0.014 - levelBonus * 0.002),
        defenseReduction: clamp(stats.strength * 0.018 + levelBonus * 0.0025, 0, 0.58),
        dropBonus: clamp(stats.intelligence * 0.025 + levelBonus * 0.002, 0, 0.75),
        dashCooldown: Math.max(1.25, 2.8 - stats.agility * 0.035)
      };
    }

    function recalculatePlayerStats(refill = false) {
      const player = state.player;
      if (!player) {
        return;
      }
      const oldMaxHp = player.maxHp || 1;
      const derived = getDerivedStats();
      player.maxHp = derived.maxHp;
      player.speed = derived.speed;
      player.damage = derived.weaponDamage;
      player.skillDamage = derived.spellDamage;
      if (refill) {
        player.hp = player.maxHp;
      } else {
        player.hp = Math.min(player.maxHp, Math.max(1, Math.round(player.hp * (player.maxHp / oldMaxHp))));
      }
    }

    function createPlayer() {
      const classDef = getClassDef();
      const player = {
        x: SHOP_ZONE.x,
        y: SHOP_ZONE.y,
        radius: 16,
        hp: 1,
        maxHp: 1,
        level: 1,
        statPoints: 0,
        stats: { ...classDef.stats },
        damage: 1,
        skillDamage: 1,
        speed: 1,
        attackTimer: 0,
        skillTimer: 0,
        windTimer: 0,
        hasteTimer: 0,
        performanceTimer: 0,
        invisible: false,
        dashTimer: 0,
        dashCooldown: 0,
        dashVx: 0,
        dashVy: 0,
        dashHits: new Set(),
        wards: {},
        shell: 0,
        bodyShield: 0
      };
      state.player = player;
      recalculatePlayerStats(true);
    }

    function getElementMultiplier(target, element) {
      return target.resists?.[normalizeDamageElement(element)] ?? 1;
    }

    function normalizeDamageElement(element) {
      if (element === "light") return "holy";
      if (element === "steam") return "fire";
      if (element === "arcane" || element === "poison") return "dark";
      return element;
    }

    function shouldFrozenShatter(target, element, spell = null) {
      if (target.kind !== "enemy" || !hasStatus(target, "frozen")) {
        return false;
      }
      if (normalizeDamageElement(element) === "physical") {
        return true;
      }
      return Boolean(spell?.queue && getSageManifestation(spell.queue) === "projectile");
    }

    function clearHeatSensitiveStatuses(target, sourceElement) {
      if (target.kind !== "enemy" || sourceElement !== "fire") {
        return;
      }
      const hadHeatSensitiveStatus = hasStatus(target, "wet") || hasStatus(target, "steamed") || hasStatus(target, "chilled") || hasStatus(target, "frozen");
      if (!hadHeatSensitiveStatus) {
        return;
      }
      clearStatus(target, "wet");
      clearStatus(target, "steamed");
      clearStatus(target, "chilled");
      clearStatus(target, "frozen");
      addTargetEffect(target, "sizzled", "Sizzled", ELEMENT_COLORS.fire, 0.8);
    }

    function applyDamage(target, amount, element = "physical", options = {}) {
      const damageElement = normalizeDamageElement(element);
      if (tryActivateElemental(target, element, options.spellQueue || null)) {
        return 0;
      }
      const elementalHealing = getElementalHealing(target, damageElement, options.spellQueue || null);
      if (elementalHealing > 0) {
        const healing = Math.min(target.maxHp - target.hp, amount);
        if (healing > 0) {
          target.hp += healing;
          target.hitTimer = 0.12;
          addTargetEffect(target, "elemental-heal", "Attuned", target.color || ELEMENT_COLORS.arcane);
        }
        return -healing;
      }
      if (target.elementalElements?.includes(damageElement)) {
        addTargetEffect(target, "immune", "Immune", target.color || "#c2b8d8");
        return 0;
      }
      if (damageElement === "dark" && target.kind === "enemy" && target.faction === "ally" && target.family === "undead") {
        const healing = Math.min(target.maxHp - target.hp, amount);
        if (healing > 0) {
          target.hp += healing;
          target.hitTimer = 0.12;
          addTargetEffect(target, "undead-heal", "Dark Mend", ELEMENT_COLORS.arcane);
        }
        return -healing;
      }
      clearHeatSensitiveStatuses(target, element);
      if (damageElement === "life" && target.kind === "enemy" && target.family !== "undead") {
        const healing = Math.min(target.maxHp - target.hp, amount);
        if (healing > 0) {
          target.hp += healing;
          target.hitTimer = 0.12;
          addTargetEffect(target, "healed", "Healed", ELEMENT_COLORS.life);
        }
        return -healing;
      }
      const multiplier = getElementMultiplier(target, damageElement);
      const shatterMultiplier = options.skipFrozenShatter ? 1 : shouldFrozenShatter(target, element) ? 4 : 1;
      const finalDamage = amount * multiplier * shatterMultiplier;
      target.hp -= finalDamage;
      if (target.hitTimer !== undefined) {
        target.hitTimer = 0.1;
      }
      if (shatterMultiplier > 1) {
        addTargetEffect(target, "shatter", "Shatter x4", ELEMENT_COLORS.earth, 0.5);
      }
      if (multiplier >= 1.45) {
        addTargetEffect(target, "weak", "Weak", ELEMENT_COLORS[element] || ELEMENT_COLORS[damageElement] || "#f7cc78");
      } else if (multiplier <= 0.65) {
        addTargetEffect(target, "resist", "Resist", "#c2b8d8");
      }
      return finalDamage;
    }

    function isHostileUnit(unit) {
      return unit.kind === "enemy" && unit.faction !== "ally" && !unit.inactiveElemental;
    }

    function isAlliedUnit(unit) {
      return unit.kind === "enemy" && unit.faction === "ally" && !unit.inactiveElemental;
    }

    function getLivingUnits(options = {}) {
      return state.enemies.filter((unit) => {
        if (unit.hp <= 0) {
          return false;
        }
        if (unit.inactiveElemental && !options.includeInactive) {
          return false;
        }
        if (options.faction === "hostile") {
          return isHostileUnit(unit);
        }
        if (options.faction === "ally") {
          return isAlliedUnit(unit);
        }
        return true;
      });
    }

    function findNearestUnit(x, y, options = {}) {
      let best = null;
      let bestDistance = Infinity;
      for (const unit of getLivingUnits(options)) {
        if (options.exclude === unit) {
          continue;
        }
        const distance = distanceSquared(x, y, unit.x, unit.y);
        if (distance < bestDistance) {
          best = unit;
          bestDistance = distance;
        }
      }
      return best;
    }

    function spawnEnemy(x, y, type = "goblin", options = {}) {
      const def = ENEMY_DEFS[type] || ENEMY_DEFS.goblin;
      const floorScale = 1 + (state.floor - 1) * 0.11;
      const bossScale = def.boss ? 1 + Math.max(0, getFloorDef().stage - 1) * 0.18 : 1;
      const point = findOpenSpawnPoint(x, y, def.radius) || { x, y };
      const scale = options.useFloorScale === false ? 1 : floorScale;
      const hp = options.maxHp || Math.round(def.hp * scale * bossScale);
      const enemy = {
        kind: "enemy",
        type,
        name: def.name,
        family: def.family,
        isBoss: Boolean(def.boss),
        faction: options.faction || "hostile",
        minion: Boolean(options.minion),
        x: point.x,
        y: point.y,
        radius: def.radius,
        hp,
        maxHp: hp,
        speed: options.speed || def.speed + (state.floor - 1) * (def.boss ? 1.5 : 3.2),
        damage: options.damage || Math.round(def.damage * (1 + (state.floor - 1) * (def.boss ? 0.06 : 0.075))),
        damageElement: def.damageElement,
        hitTimer: 0,
        attackTimer: 0,
        xp: options.minion ? 0 : Math.round(def.xp * scale),
        gold: options.minion ? 0 : Math.round(def.gold * scale),
        color: options.color || def.color,
        resists: { ...def.resists, ...(options.resists || {}) },
        statuses: {}
      };
      state.enemies.push(enemy);
      return enemy;
    }

    function spawnEnemyNear(x, y, type = "goblin") {
      const def = ENEMY_DEFS[type] || ENEMY_DEFS.goblin;
      const point = findOpenSpawnPoint(x, y, def.radius, 42, 132);
      if (point) {
        spawnEnemy(point.x, point.y, type);
      }
    }

    function spawnAnchor(x, y) {
      const floorDef = getFloorDef();
      const hp = Math.round(floorDef.anchorHp);
      const point = findOpenSpawnPoint(x, y, 28) || { x, y };
      state.anchors.push({
        kind: "anchor",
        x: point.x,
        y: point.y,
        radius: 28,
        hp,
        maxHp: hp,
        spawnTimer: 1.8,
        element: "dark",
        resists: { dark: 0.45, holy: 1.7, arcane: 1.25 }
      });
    }

    function startFloor(floorNumber) {
      state.floor = floorNumber;
      state.floorClear = false;
      buildMap();
      const floorDef = getFloorDef();
      state.realmKey = floorDef.realmId || state.realmKey;
      if (!state.player) {
        createPlayer();
      }
      state.player.x = SHOP_ZONE.x;
      state.player.y = SHOP_ZONE.y;
      state.player.hp = state.player.maxHp;
      state.player.attackTimer = 0;
      state.player.skillTimer = 0;
      state.player.windTimer = 0;
      state.player.hasteTimer = 0;
      state.player.dashTimer = 0;
      state.player.dashCooldown = 0;
      state.player.dashVx = 0;
      state.player.dashVy = 0;
      state.player.dashHits.clear();
      state.player.wards = {};
      state.player.shell = 0;
      state.player.bodyShield = 0;
      state.enemies = [];
      state.projectiles = [];
      state.pickups = [];
      state.effects = [];
      state.anchors = [];
      state.hazards = [];
      state.sageQueue = [];
      state.sageChannel = null;
      state.sageMessage = "";
      state.rainTimer = 0;
      state.rainTickTimer = 0;
      state.timeWarpTimer = 0;
      state.meteorShowers = [];
      state.nearShop = true;
      state.player.invisible = false;
      state.player.performanceTimer = 0;
      for (const [col, row] of floorDef.anchors) {
        spawnAnchor(TILE * col, TILE * row);
      }
      for (const [type, col, row] of floorDef.startEnemies) {
        spawnEnemy(TILE * col, TILE * row, type);
      }
      addEffect(state.player.x, state.player.y - 30, floorDef.name, floorDef.color || "#f7cc78");
      playContextMusic({ screen: "play", floorDef });
      playLevelLoadStinger(floorDef);
      playBossIntroSfx(floorDef);
      lastTick = 0;
    }

    function resetRunProgress() {
      createPlayer();
      state.floor = 1;
      state.realmKey = "graveyard";
      state.floorClear = false;
      state.elapsed = 0;
      state.gold = 0;
      state.xp = 0;
      state.xpToNext = 30;
      state.shopPurchases = 0;
      state.quests = {
        kills: 0,
        anchorsCleared: 0,
        claimed: {}
      };
      state.enemies = [];
      state.projectiles = [];
      state.pickups = [];
      state.effects = [];
      state.anchors = [];
      state.hazards = [];
      state.sageQueue = [];
      state.sageChannel = null;
      state.sageMessage = "";
      state.rainTimer = 0;
      state.rainTickTimer = 0;
      state.timeWarpTimer = 0;
      state.meteorShowers = [];
      state.realmsCleared = {};
      state.realmProgress = {};
      state.audioOnce = {};
      state.hubPortalCooldown = 0;
      state.nearShop = true;
      buildMap();
      lastShopMarkup = "";
      lastQuestMarkup = "";
      state.camera.x = clamp(state.player.x - canvas.width / DPR * 0.5, 0, WORLD_W - canvas.width / DPR);
      state.camera.y = clamp(state.player.y - canvas.height / DPR * 0.5, 0, WORLD_H - canvas.height / DPR);
    }

    function resetGame(floorNumber = getCurrentRealmDef().floor) {
      resetRunProgress();
      hideScreens();
      state.screen = "play";
      state.running = true;
      startFloor(floorNumber);
    }

    function nextFloor() {
      if (!state.floorClear) {
        return;
      }
      playSfx("portal", { volume: 0.34, throttle: 0.6 });
      openRealmHub();
    }

    function hasLivingBoss() {
      return state.enemies.some((enemy) => enemy.isBoss && enemy.hp > 0 && isHostileUnit(enemy));
    }

    function isFloorObjectiveCleared() {
      return state.anchors.length === 0 && !hasLivingBoss();
    }

    function completeFloor() {
      if (state.floorClear) {
        return;
      }
      const floorDef = getFloorDef();
      state.floorClear = true;
      const nextStage = Math.min(floorDef.stage + 1, floorDef.stageCount);
      state.realmProgress[floorDef.realmId] = Math.max(state.realmProgress[floorDef.realmId] || 1, nextStage);
      if (floorDef.stage >= floorDef.stageCount) {
        state.realmsCleared[floorDef.realmId] = true;
      }
      addEffect(state.player.x, state.player.y - 34, "Exit Portal Open", "#63f0c4");
      playSfx("quest", { volume: 0.32, throttle: 0.5 });
      playBossClearStinger(floorDef);
    }

    function gainXp(amount) {
      if (isSage()) {
        return;
      }
      state.xp += amount;
      while (state.xp >= state.xpToNext) {
        state.xp -= state.xpToNext;
        state.xpToNext = Math.round(state.xpToNext * 1.22 + 12);
        state.player.level += 1;
        grantStatPoint();
        recalculatePlayerStats(true);
        addEffect(state.player.x, state.player.y - 22, "+1 Stat Point", "#f7cc78");
      }
    }

    function grantStatPoint() {
      if (isSage()) {
        return false;
      }
      state.player.statPoints += 1;
      return true;
    }

    function addEffect(x, y, text, color = "#f0ebff") {
      state.effects.push({ x, y, text, color, life: 0.8, maxLife: 0.8 });
    }

    function addTargetEffect(target, key, text, color, cooldown = 0.55) {
      target.effectTimers ||= {};
      if ((target.effectTimers[key] || 0) > state.elapsed) {
        return;
      }
      target.effectTimers[key] = state.elapsed + cooldown;
      addEffect(target.x, target.y - target.radius - 12, text, color);
    }

    function getStatuses(target) {
      target.statuses ||= {};
      return target.statuses;
    }

    function hasStatus(target, key) {
      return (target.statuses?.[key]?.time || 0) > 0;
    }

    function clearStatus(target, key) {
      if (target.statuses?.[key]) {
        delete target.statuses[key];
      }
    }

    function applyStatus(target, key, duration, magnitude = 1) {
      if (target.kind !== "enemy") {
        return;
      }
      const def = STATUS_DEFS[key];
      const statuses = getStatuses(target);
      const current = statuses[key];
      statuses[key] = {
        time: Math.max(current?.time || 0, duration),
        magnitude: Math.max(current?.magnitude || 0, magnitude)
      };
      addTargetEffect(target, `status-${key}`, def?.label || key, def?.color || "#f0ebff", 1.15);
    }

    function applySageStatusReactions(target, queue) {
      if (target.kind !== "enemy" || !queue?.length) {
        return 1;
      }
      let damageMultiplier = 1;
      const waterCount = countElement(queue, "water");
      const coldCount = countAny(queue, ["cold", "ice"]);
      const fireCount = countElement(queue, "fire");
      const steamCount = countElement(queue, "steam");
      const lightningCount = countElement(queue, "lightning");
      const poisonCount = countElement(queue, "poison");
      const lifeCount = countAny(queue, ["life", "light"]);
      const physicalCount = countAny(queue, ["earth", "ice"]);

      if (waterCount) {
        if (hasStatus(target, "burning")) {
          clearStatus(target, "burning");
          addTargetEffect(target, "doused", "Doused", ELEMENT_COLORS.water, 1);
        }
        applyStatus(target, "wet", 4 + waterCount * 0.7, waterCount);
      }

      if (fireCount) {
        if (hasStatus(target, "wet") || hasStatus(target, "steamed") || hasStatus(target, "chilled") || hasStatus(target, "frozen")) {
          damageMultiplier += 0.18;
          clearStatus(target, "wet");
          clearStatus(target, "steamed");
          clearStatus(target, "chilled");
          clearStatus(target, "frozen");
        }
        applyStatus(target, "burning", 3.6 + fireCount * 0.55, fireCount);
      }

      if (steamCount) {
        if (hasStatus(target, "chilled") || hasStatus(target, "frozen")) {
          damageMultiplier += 0.1;
          clearStatus(target, "chilled");
          clearStatus(target, "frozen");
        }
        applyStatus(target, "steamed", 5 + steamCount * 0.8, steamCount);
      }

      if (coldCount) {
        if (hasStatus(target, "burning")) {
          clearStatus(target, "burning");
        }
        if (hasStatus(target, "wet") || hasStatus(target, "steamed")) {
          clearStatus(target, "wet");
          clearStatus(target, "steamed");
          applyStatus(target, "frozen", 2.2 + coldCount * 0.45, coldCount);
          damageMultiplier += 0.12;
        } else {
          applyStatus(target, "chilled", 4.2 + coldCount * 0.65, coldCount);
        }
      }

      if (lightningCount) {
        if (hasStatus(target, "wet") || hasStatus(target, "steamed") || hasStatus(target, "frozen")) {
          damageMultiplier += 0.55 + lightningCount * 0.08;
          addTargetEffect(target, "conducted", "Conducted", ELEMENT_COLORS.lightning, 1);
        }
        applyStatus(target, "shocked", 1.2 + lightningCount * 0.22, lightningCount);
      }

      if (poisonCount) {
        applyStatus(target, "poisoned", 5 + poisonCount * 0.8, poisonCount);
      }

      if (lifeCount && hasStatus(target, "poisoned")) {
        clearStatus(target, "poisoned");
        addTargetEffect(target, "cleansed", "Cleansed", ELEMENT_COLORS.life, 1);
      }

      if (physicalCount && hasStatus(target, "frozen")) {
        addTargetEffect(target, "shatter-ready", "Brittle", ELEMENT_COLORS.earth, 1);
      }

      return damageMultiplier;
    }

    function applySageHit(target, amount, element, spell = null) {
      const queue = spell?.queue || null;
      if (tryActivateElemental(target, element, queue)) {
        return 0;
      }
      let finalAmount = amount;
      if (queue) {
        finalAmount *= applySageStatusReactions(target, queue);
      }
      const shattersFrozen = shouldFrozenShatter(target, element, spell);
      if (shattersFrozen) {
        finalAmount *= 4;
        addTargetEffect(target, "shatter", "Shatter x4", ELEMENT_COLORS.earth, 0.5);
      }
      if (finalAmount > 0) {
        return applyDamage(target, finalAmount, element, { skipFrozenShatter: true, spellQueue: queue });
      }
      return 0;
    }

    function updateTargetStatuses(target, dt) {
      const statuses = target.statuses;
      if (!statuses) {
        return 1;
      }
      let speedMultiplier = 1;
      for (const [key, status] of Object.entries(statuses)) {
        if (!STATUS_DEFS[key]?.sticky) {
          status.time -= dt;
        }
        if (key === "burning") {
          applyDamage(target, (1.5 + status.magnitude * 0.85) * dt, "fire");
        } else if (key === "poisoned") {
          applyDamage(target, (1.1 + status.magnitude * 0.7) * dt, "dark");
        } else if (key === "chilled") {
          speedMultiplier *= 0.62;
        } else if (key === "frozen") {
          speedMultiplier *= 0.18;
        } else if (key === "shocked") {
          speedMultiplier *= 0.72;
        } else if (key === "steamed") {
          speedMultiplier *= 0.86;
        }
        if (status.time <= 0) {
          delete statuses[key];
        }
      }
      return speedMultiplier;
    }

    function dropLoot(x, y, enemy) {
      const dropBonus = getDerivedStats().dropBonus;
      state.pickups.push({ type: "gold", x, y, radius: 8, value: Math.round(enemy.gold * (1 + dropBonus * 0.45)), color: "#f7cc78" });
      if (Math.random() < 0.3 + dropBonus * 0.32) {
        state.pickups.push({ type: "health", x: x + 12, y: y - 6, radius: 7, value: 18, color: "#ff668a" });
      }
      if (Math.random() < dropBonus * 0.22) {
        state.pickups.push({ type: "gold", x: x - 10, y: y + 8, radius: 7, value: Math.max(2, Math.round(enemy.gold * 0.35)), color: "#ffe873" });
      }
    }

    function isSage() {
      return state.classKey === "sage";
    }

    function isPojo() {
      return state.classKey === "pojo";
    }

    function getSageQueueLabel() {
      if (!state.sageQueue.length) {
        return "Queue: empty";
      }
      return `Queue: ${state.sageQueue.map((element) => SAGE_ELEMENT_DEFS[element]?.label || element).join(" + ")}`;
    }

    function renderSagePanel() {
      const showPanel = isSage();
      sagePanel.hidden = !showPanel;
      sageQueueText.textContent = getSageQueueLabel();
      sageMessage.textContent = state.sageMessage || "Use opposite elements to alter the queue. Wet and steam conduct lightning, cold freezes them, fire dries them, and frozen targets shatter under physical projectiles.";
      for (const button of sageElementButtons) {
        button.disabled = !isSage();
      }
      for (const button of sageCastButtons) {
        button.disabled = !isSage();
      }
    }

    function renderClassButtons() {
      const classDef = getClassDef();
      classStat.textContent = classDef.name;
      heroNameValue.textContent = state.heroName || DEFAULT_HERO_NAME;
      classSummary.textContent = classDef.summary;
      for (const button of classButtons) {
        const def = CLASS_DEFS[button.dataset.class];
        button.hidden = Boolean(def?.secret);
        button.disabled = Boolean(state.nameOverrideClass);
        button.classList.toggle("is-active", button.dataset.class === state.classKey);
      }
      renderCharacterSelect();
      renderSagePanel();
    }

    function renderShop() {
      shopText.textContent = state.nearShop
        ? "Rift Market is open. Spend gold on supplies or permanent class training."
        : state.screen === "hub"
          ? "Return to the central market circle to buy supplies and training."
          : "Return to the glowing market circle near the gate to buy supplies and training.";
      const markup = SHOP_ITEMS.map((item) => {
        const affordable = state.gold >= item.cost;
        const unavailable = isSage() && item.id === "training";
        const disabled = !state.nearShop || !affordable || unavailable ? " disabled" : "";
        const detail = unavailable ? "Sage does not use levels." : item.detail;
        return `<button class="shop-button" type="button" data-shop="${item.id}"${disabled}>${item.label}<small>${item.cost}g - ${detail}</small></button>`;
      }).join("");
      if (markup !== lastShopMarkup) {
        shopList.innerHTML = markup;
        lastShopMarkup = markup;
      }
    }

    function renderQuests() {
      const markup = QUEST_DEFS.map((quest) => {
        const progress = Math.min(quest.target, quest.progress());
        const claimed = Boolean(state.quests.claimed[quest.id]);
        const complete = progress >= quest.target;
        const claimButton = complete && !claimed
          ? `<button class="quest-claim" type="button" data-quest="${quest.id}">Claim</button>`
          : "";
        const status = claimed ? "Complete" : `${progress} / ${quest.target}`;
        const reward = isSage() ? quest.reward.replace(/,? ?\d+ XP/g, "").replace(/,? ?\+1 stat point/g, "") : quest.reward;
        return `<div class="quest-item${complete ? " is-complete" : ""}"><strong>${quest.name}</strong><small>${quest.detail}<br>Progress: ${status}<br>Reward: ${reward}</small>${claimButton}</div>`;
      }).join("");
      if (markup !== lastQuestMarkup) {
        questList.innerHTML = markup;
        lastQuestMarkup = markup;
      }
    }

    function buyShopItem(itemId) {
      const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
      if (!item || !state.nearShop || state.gold < item.cost || (isSage() && item.id === "training")) {
        return;
      }
      state.gold -= item.cost;
      state.shopPurchases += 1;
      item.buy();
      playSfx("quest", { volume: 0.28, throttle: 0.12 });
      lastShopMarkup = "";
    }

    function claimQuest(questId) {
      const quest = QUEST_DEFS.find((entry) => entry.id === questId);
      if (!quest || state.quests.claimed[quest.id] || quest.progress() < quest.target) {
        return;
      }
      state.quests.claimed[quest.id] = true;
      quest.claim();
      addEffect(state.player.x, state.player.y - 36, "Quest Complete", "#63f0c4");
      playSfx("quest", { volume: 0.34, throttle: 0.12 });
      lastQuestMarkup = "";
      lastShopMarkup = "";
    }

    function assignStat(stat) {
      if (isSage()) {
        state.sageMessage = "The Sage does not level or allocate stat points.";
        return;
      }
      if (!["strength", "intelligence", "agility"].includes(stat) || state.player.statPoints <= 0) {
        return;
      }
      state.player.statPoints -= 1;
      state.player.stats[stat] += 1;
      recalculatePlayerStats(false);
      addEffect(state.player.x, state.player.y - 28, `+1 ${stat.toUpperCase()}`, "#f7cc78");
      playSfx("quest", { volume: 0.24, throttle: 0.12 });
    }

    function removeOne(queue, element) {
      const index = queue.lastIndexOf(element);
      if (index >= 0) {
        queue.splice(index, 1);
      }
    }

    function elementLabel(element) {
      return SAGE_ELEMENT_DEFS[element]?.label || element;
    }

    function replaceOne(queue, from, to) {
      const index = queue.lastIndexOf(from);
      if (index >= 0) {
        queue[index] = to;
        return true;
      }
      return false;
    }

    function removeAndReport(queue, element, message) {
      removeOne(queue, element);
      return { queue, message };
    }

    function splitCombinedElement(queue, combined, remainder, message) {
      replaceOne(queue, combined, remainder);
      return { queue, message };
    }

    function combineSageElements(queue, element, pair, combined) {
      if (!queue.includes(pair)) {
        return null;
      }
      replaceOne(queue, pair, combined);
      return {
        queue,
        message: `${elementLabel(pair)} + ${elementLabel(element)} became ${elementLabel(combined)}.`
      };
    }

    function transformSageQueue(currentQueue, element) {
      const queue = [...currentQueue];

      if (queue.includes("poison")) {
        if (element === "life") {
          return splitCombinedElement(queue, "poison", "water", "Life purged Arcane from Poison, leaving Water.");
        }
      }

      if (queue.includes("light")) {
        if (element === "arcane") {
          return splitCombinedElement(queue, "light", "fire", "Arcane cancelled Life from Light, leaving Fire.");
        }
      }

      if (queue.includes("steam")) {
        if (element === "cold") {
          return splitCombinedElement(queue, "steam", "water", "Cold cancelled Fire in Steam, leaving Water.");
        }
      }

      if (queue.includes("ice")) {
        if (element === "fire") {
          return splitCombinedElement(queue, "ice", "water", "Fire cancelled Cold in Ice, leaving Water.");
        }
      }

      if (element === "cold" && queue.includes("fire")) {
        return removeAndReport(queue, "fire", "Cold cancelled Fire.");
      }
      if (element === "fire" && queue.includes("cold")) {
        return removeAndReport(queue, "cold", "Fire cancelled Cold.");
      }
      if (element === "life" && queue.includes("arcane")) {
        return removeAndReport(queue, "arcane", "Life cancelled Arcane.");
      }
      if (element === "arcane" && queue.includes("life")) {
        return removeAndReport(queue, "life", "Arcane cancelled Life.");
      }
      if (element === "lightning" && queue.includes("earth")) {
        return removeAndReport(queue, "earth", "Lightning shattered Earth.");
      }
      if (element === "earth" && queue.includes("lightning")) {
        return removeAndReport(queue, "lightning", "Earth grounded Lightning.");
      }
      if (element === "lightning" && queue.includes("water")) {
        return removeAndReport(queue, "water", "Lightning consumed Water.");
      }
      if (element === "water" && queue.includes("lightning")) {
        return removeAndReport(queue, "lightning", "Water grounded Lightning.");
      }
      if (element === "shield" && queue.includes("shield")) {
        return removeAndReport(queue, "shield", "Shield cancelled Shield.");
      }

      const combined =
        (element === "water" && combineSageElements(queue, element, "fire", "steam")) ||
        (element === "fire" && combineSageElements(queue, element, "water", "steam")) ||
        (element === "water" && combineSageElements(queue, element, "cold", "ice")) ||
        (element === "cold" && combineSageElements(queue, element, "water", "ice")) ||
        (element === "water" && combineSageElements(queue, element, "arcane", "poison")) ||
        (element === "arcane" && combineSageElements(queue, element, "water", "poison")) ||
        (element === "life" && combineSageElements(queue, element, "fire", "light")) ||
        (element === "fire" && combineSageElements(queue, element, "life", "light"));
      if (combined) {
        return combined;
      }

      if (queue.length >= 5) {
        return { queue, message: "The queue is full." };
      }
      queue.push(element);
      return { queue, message: `${elementLabel(element)} queued.` };
    }

    function queueSageElement(element) {
      if (!isSage()) {
        state.sageMessage = "Only the Sage can queue elements.";
        return;
      }
      const result = transformSageQueue(state.sageQueue, element);
      state.sageQueue = result.queue;
      state.sageMessage = result.message;
    }

    function clearSageQueue(message = "Queue cleared.") {
      state.sageQueue = [];
      state.sageMessage = message;
    }

    function setClass(classKey) {
      if (!CLASS_DEFS[classKey] || state.classKey === classKey) {
        return;
      }
      if (CLASS_DEFS[classKey].secret) {
        state.sageMessage = "Hidden heroes answer only to their name.";
        return;
      }
      if (state.nameOverrideClass) {
        state.sageMessage = "Change thy name to leave this hidden hero.";
        addEffect(state.player.x, state.player.y - 26, "Name Bound", "#f7cc78");
        return;
      }
      state.classKey = classKey;
      state.selectedClassKey = classKey;
      state.sageQueue = [];
      state.sageMessage = "";
      lastShopMarkup = "";
      lastQuestMarkup = "";
      if (state.screen !== "play") {
        resetRunProgress();
        if (state.screen === "hub") {
          openRealmHub();
        } else {
          openCharacterSelect();
        }
        return;
      }
      resetGame(getCurrentRealmDef().floor);
    }

    function findBlinkDestination(angle, range, allowThinWalls = true) {
      const player = state.player;
      let bestX = player.x;
      let bestY = player.y;
      let blockedDistance = 0;
      for (let step = 24; step <= range; step += 16) {
        const x = clamp(player.x + Math.cos(angle) * step, player.radius, WORLD_W - player.radius);
        const y = clamp(player.y + Math.sin(angle) * step, player.radius, WORLD_H - player.radius);
        if (circleBlocked(x, y, player.radius)) {
          if (!allowThinWalls) {
            break;
          }
          blockedDistance += 16;
          if (blockedDistance > TILE + 18) {
            break;
          }
          continue;
        }
        blockedDistance = 0;
        bestX = x;
        bestY = y;
      }
      return { x: bestX, y: bestY };
    }

    function sageSpell(queue) {
      return { queue };
    }

    function getSageDamageElement(queue) {
      if (queue.includes("light")) return "light";
      if (queue.includes("life")) return "life";
      if (queue.includes("poison") || queue.includes("arcane")) return "dark";
      if (queue.includes("lightning")) return "lightning";
      if (queue.includes("earth")) return "physical";
      if (queue.includes("ice") || queue.includes("cold")) return "water";
      if (queue.includes("fire")) return "fire";
      if (queue.includes("steam")) return "steam";
      if (queue.includes("water")) return "water";
      return "dark";
    }

    function getSageComboSpellKey(queue) {
      if (queueMatches(queue, ["lightning", "arcane", "fire"])) return "haste";
      if (queueMatches(queue, ["lightning", "lightning", "arcane"])) return "blink";
      if (queueMatches(queue, ["arcane", "shield", "steam", "arcane"])) return "invisibility";
      if (queueMatches(queue, ["water", "steam"])) return "rain";
      if (queueMatches(queue, ["cold", "arcane", "shield"])) return "fear";
      if (queueMatches(queue, ["life", "shield", "earth"])) return "charm";
      if (queueMatches(queue, ["fire", "earth", "steam", "earth", "fire"])) return "meteorShower";
      if (queueMatches(queue, ["cold", "shield"])) return "timeWarp";
      if (queueMatches(queue, ["ice", "arcane", "ice", "shield", "ice"])) return "vortex";
      if (queueMatches(queue, ["ice", "earth", "arcane", "cold"])) return "raiseDead";
      if (queueMatches(queue, ["arcane", "shield", "earth", "steam", "arcane"])) return "summonElemental";
      if (queueMatches(queue, ["arcane", "cold", "ice", "cold", "arcane"])) return "summonDeath";
      if (queueMatches(queue, ["life", "light", "lightning", "light", "life"])) return "performance";
      return null;
    }

    function castSageComboSpell(method, queue) {
      const key = getSageComboSpellKey(queue);
      if (!key) {
        return false;
      }
      const player = state.player;
      if (key === "haste") {
        const wasHasted = player.hasteTimer > 0;
        player.hasteTimer = 8;
        player.dashCooldown = 0;
        addEffect(player.x, player.y - 24, wasHasted ? "Haste Refreshed" : "Haste", ELEMENT_COLORS.lightning);
        state.effects.push({ kind: "nova", x: player.x, y: player.y, range: 86, life: 0.18, maxLife: 0.18, color: "rgba(255, 232, 115, 0.22)" });
      } else if (key === "blink") {
        blinkPlayerThroughThinWall(360);
      } else if (key === "invisibility") {
        player.invisible = true;
        addEffect(player.x, player.y - 24, "Invisible", ELEMENT_COLORS.arcane);
      } else if (key === "rain") {
        state.rainTimer = Math.max(state.rainTimer, 17.5);
        state.rainTickTimer = 0;
        addEffect(player.x, player.y - 26, "Rainfall", ELEMENT_COLORS.water);
      } else if (key === "fear") {
        fearHostiles(6.5);
      } else if (key === "charm") {
        charmNearestEnemy(35);
      } else if (key === "meteorShower") {
        startMeteorShower(17.5);
      } else if (key === "timeWarp") {
        state.timeWarpTimer = Math.max(state.timeWarpTimer, 15);
        addEffect(player.x, player.y - 26, "Time Warp", ELEMENT_COLORS.cold);
      } else if (key === "vortex") {
        summonVortex(queue);
      } else if (key === "raiseDead") {
        raiseDeadMinions();
      } else if (key === "summonElemental") {
        summonInactiveElemental();
      } else if (key === "summonDeath") {
        summonDeath();
      } else if (key === "performance") {
        player.performanceTimer = Math.max(player.performanceTimer, 17.5);
        addEffect(player.x, player.y - 26, "Performance", ELEMENT_COLORS.light);
      }
      state.sageMessage = `${key.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())} spell cast.`;
      return true;
    }

    function getSagePrimaryElement(queue) {
      const order = ["shield", "earth", "ice", "life", "light", "arcane", "lightning", "water", "fire", "cold", "steam", "poison"];
      return order.find((element) => queue.includes(element)) || queue[0] || "wind";
    }

    function getSageColor(queue) {
      const element = getSagePrimaryElement(queue);
      return ELEMENT_COLORS[element] || ELEMENT_COLORS[getSageDamageElement(queue)] || "#f0ebff";
    }

    function getSageEffectColor(queue, alpha = 0.22) {
      if (queue.includes("light")) return `rgba(255, 241, 168, ${alpha})`;
      if (queue.includes("life")) return `rgba(157, 247, 164, ${alpha})`;
      if (queue.includes("poison")) return `rgba(120, 216, 90, ${alpha})`;
      if (queue.includes("arcane")) return `rgba(156, 128, 255, ${alpha})`;
      if (queue.includes("lightning")) return `rgba(255, 232, 115, ${alpha})`;
      if (queue.includes("water") || queue.includes("cold") || queue.includes("ice")) return `rgba(75, 217, 255, ${alpha})`;
      if (queue.includes("fire") || queue.includes("steam")) return `rgba(255, 139, 74, ${alpha})`;
      return `rgba(216, 247, 255, ${alpha})`;
    }

    function getSageManifestation(queue) {
      if (!queue.length) return "wind";
      if (queue.includes("shield")) return "shield";
      if (queue.includes("earth") || queue.includes("ice")) return "projectile";
      if (queue.includes("life") || queue.includes("light") || queue.includes("arcane")) return "beam";
      if (isLightningSpellQueue(queue)) return "lightning";
      return "spray";
    }

    function getSagePower(queue) {
      const derived = getDerivedStats();
      return derived.spellDamage * (0.62 + queue.length * 0.24);
    }

    function countElement(queue, element) {
      return queue.filter((entry) => entry === element).length;
    }

    function queueCounts(queue) {
      const counts = new Map();
      for (const element of queue) {
        counts.set(element, (counts.get(element) || 0) + 1);
      }
      return counts;
    }

    function queueMatches(queue, pattern) {
      if (!queue || queue.length !== pattern.length) {
        return false;
      }
      const a = queueCounts(queue);
      const b = queueCounts(pattern);
      if (a.size !== b.size) {
        return false;
      }
      for (const [element, count] of b.entries()) {
        if (a.get(element) !== count) {
          return false;
        }
      }
      return true;
    }

    function normalizedQueueElements(queue) {
      return queue.map((element) => normalizeDamageElement(element));
    }

    function getElementalActivationQueue(element, spellQueue = null) {
      return spellQueue?.length ? [...spellQueue] : [element];
    }

    function getElementalHealing(target, damageElement, spellQueue = null) {
      if (!target.elementalQueue?.length) {
        return 0;
      }
      if (spellQueue?.length) {
        return queueMatches(spellQueue, target.elementalQueue) ? 1 : 0;
      }
      return target.elementalQueue.length === 1 && normalizeDamageElement(target.elementalQueue[0]) === damageElement ? 1 : 0;
    }

    function tryActivateElemental(target, element, spellQueue = null) {
      if (!target?.inactiveElemental || target.hp <= 0) {
        return false;
      }
      const queue = getElementalActivationQueue(element, spellQueue);
      const maxHp = 400 + queue.length * 100;
      target.inactiveElemental = false;
      target.faction = "ally";
      target.minion = true;
      target.elementalQueue = [...queue];
      target.elementalElements = [...new Set(normalizedQueueElements(queue))];
      target.maxHp = maxHp;
      target.hp = maxHp;
      target.damage = Math.round(30 + queue.length * 12);
      target.speed = 118;
      target.color = getSageColor(queue);
      target.damageElement = getSageDamageElement(queue);
      target.name = `${elementLabel(queue[0])} Elemental`;
      addEffect(target.x, target.y - target.radius - 16, "Elemental Awakened", target.color);
      return true;
    }

    function blinkPlayerThroughThinWall(range = 360) {
      const player = state.player;
      const fromX = player.x;
      const fromY = player.y;
      const destination = findBlinkDestination(getAimAngle(), range, true);
      player.x = destination.x;
      player.y = destination.y;
      player.dashTimer = 0.08;
      addEffect(fromX, fromY - 20, "Blink", ELEMENT_COLORS.arcane);
      addEffect(player.x, player.y - 20, "Blink", ELEMENT_COLORS.arcane);
    }

    function getScreenBounds(padding = 40) {
      const viewW = canvas.width / DPR;
      const viewH = canvas.height / DPR;
      return {
        left: state.camera.x - padding,
        right: state.camera.x + viewW + padding,
        top: state.camera.y - padding,
        bottom: state.camera.y + viewH + padding
      };
    }

    function isInScreenBounds(unit, padding = 40) {
      const bounds = getScreenBounds(padding);
      return unit.x >= bounds.left && unit.x <= bounds.right && unit.y >= bounds.top && unit.y <= bounds.bottom;
    }

    function fearHostiles(duration) {
      let count = 0;
      for (const enemy of getLivingUnits({ faction: "hostile" })) {
        if (!isInScreenBounds(enemy, 90)) {
          continue;
        }
        enemy.fearTimer = Math.max(enemy.fearTimer || 0, duration);
        addTargetEffect(enemy, "fear", "Fear", ELEMENT_COLORS.cold, 1);
        count += 1;
      }
      addEffect(state.player.x, state.player.y - 30, `${count} feared`, ELEMENT_COLORS.cold);
    }

    function charmNearestEnemy(duration) {
      const target = findNearestUnit(state.player.x, state.player.y, { faction: "hostile" });
      if (!target) {
        addEffect(state.player.x, state.player.y - 30, "No Target", "#c2b8d8");
        return;
      }
      target.faction = "ally";
      target.charmed = true;
      target.minion = true;
      target.charmTimer = duration;
      target.baseColor ||= target.color;
      target.color = "#9df7a4";
      addTargetEffect(target, "charmed", "Charmed", ELEMENT_COLORS.life, 0.2);
    }

    function startMeteorShower(duration) {
      state.meteorShowers.push({
        life: duration,
        nextMeteor: 0,
        damage: getDerivedStats().spellDamage * 42
      });
      addEffect(state.player.x, state.player.y - 32, "Meteor Shower", ELEMENT_COLORS.fire);
    }

    function summonMeteorWarning(damage) {
      const bounds = getScreenBounds(10);
      for (let attempt = 0; attempt < 24; attempt += 1) {
        const x = clamp(bounds.left + Math.random() * (bounds.right - bounds.left), 48, WORLD_W - 48);
        const y = clamp(bounds.top + Math.random() * (bounds.bottom - bounds.top), 48, WORLD_H - 48);
        if (!circleBlocked(x, y, 18)) {
          addHazard({
            x,
            y,
            radius: 76,
            damage,
            element: "fire",
            color: ELEMENT_COLORS.fire,
            kind: "meteorWarning",
            life: 0.85,
            tickRate: 1
          });
          return;
        }
      }
    }

    function summonVortex(queue) {
      const point = getSageTargetPoint(188, 24);
      addHazard({
        x: point.x,
        y: point.y,
        radius: 104,
        maxRadius: 260,
        damage: getDerivedStats().spellDamage * 1.1,
        element: "dark",
        color: getSageColor(queue),
        kind: "vortex",
        life: 9999,
        tickRate: 0.12,
        pull: 270,
        idleAtFull: 0
      });
      addEffect(point.x, point.y - 32, "Vortex", getSageColor(queue));
    }

    function raiseDeadMinions() {
      const types = ["zombie", "skeleton", "ghoul", "wraithling"];
      for (let index = 0; index < 5; index += 1) {
        const angle = (index / 5) * TAU + Math.random() * 0.4;
        const point = findOpenSpawnPoint(state.player.x + Math.cos(angle) * 76, state.player.y + Math.sin(angle) * 76, 18, 0, 42);
        if (point) {
          const minion = spawnEnemy(point.x, point.y, types[Math.floor(Math.random() * types.length)], { faction: "ally", minion: true, useFloorScale: false });
          minion.color = "#9df7a4";
        }
      }
      addEffect(state.player.x, state.player.y - 32, "Raise Dead", ELEMENT_COLORS.arcane);
    }

    function summonInactiveElemental() {
      const point = getSageTargetPoint(118, 22);
      const elemental = {
        kind: "enemy",
        type: "elemental",
        name: "Dormant Elemental",
        family: "elemental",
        faction: "neutral",
        inactiveElemental: true,
        minion: true,
        isBoss: false,
        x: point.x,
        y: point.y,
        radius: 24,
        hp: 400,
        maxHp: 400,
        speed: 0,
        damage: 0,
        damageElement: "arcane",
        hitTimer: 0,
        attackTimer: 0,
        xp: 0,
        gold: 0,
        color: "#c2b8d8",
        resists: {},
        statuses: {}
      };
      state.enemies.push(elemental);
      addEffect(point.x, point.y - 34, "Dormant Elemental", "#c2b8d8");
    }

    function summonDeath() {
      const point = getSageTargetPoint(96, 18);
      const candidates = getLivingUnits({ includeInactive: false })
        .filter((unit) => unit.family !== "undead");
      candidates.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp) || distanceSquared(point.x, point.y, a.x, a.y) - distanceSquared(point.x, point.y, b.x, b.y));
      state.effects.push({ kind: "nova", x: point.x, y: point.y, range: 132, life: 0.3, maxLife: 0.3, color: "rgba(20, 10, 30, 0.72)" });
      if (candidates[0]) {
        candidates[0].hp = 0;
        addEffect(candidates[0].x, candidates[0].y - candidates[0].radius - 18, "Death", "#f0ebff");
      } else {
        recoverPlayerAtGate("Death Claimed You");
      }
    }

    function countAny(queue, elements) {
      return elements.reduce((total, element) => total + countElement(queue, element), 0);
    }

    function getDominantElementCount(queue) {
      const counts = new Map();
      for (const element of queue) {
        counts.set(element, (counts.get(element) || 0) + 1);
      }
      return Math.max(1, ...counts.values());
    }

    function hasAny(queue, elements) {
      return elements.some((element) => queue.includes(element));
    }

    function isLightningSpellQueue(queue) {
      return queue.length > 0 && queue.includes("lightning") && !queue.includes("steam");
    }

    function isPureWaterQueue(queue) {
      return queue.length > 0 && queue.every((element) => element === "water");
    }

    function getWaterPushBonus(queue) {
      return countElement(queue, "water") * 24;
    }

    function addWaterPush(queue, push) {
      return push > 0 ? push + getWaterPushBonus(queue) : 0;
    }

    function getPureWaterPush(queue) {
      return 78 + countElement(queue, "water") * 24;
    }

    function getSageRadius(queue, base = 86) {
      return base + queue.length * 18 + countAny(queue, ["earth", "ice"]) * 22 + countElement(queue, "shield") * 18;
    }

    function getDamageableTargets(options = {}) {
      const normalizedElement = options.element ? normalizeDamageElement(options.element) : null;
      const units = state.enemies.filter((unit) => {
        if (unit.hp <= 0) {
          return false;
        }
        if (options.allUnits) {
          return !unit.inactiveElemental || options.includeInactive;
        }
        if (isAlliedUnit(unit)) {
          if (unit.elementalQueue?.length && getElementalHealing(unit, normalizedElement, options.spell?.queue || null)) {
            return true;
          }
          return Boolean(options.spell?.queue && unit.family === "undead" && (normalizedElement === "dark" || normalizedElement === "life"));
        }
        return isHostileUnit(unit) || unit.inactiveElemental;
      });
      return options.includeAnchors === false ? units : [...units, ...state.anchors];
    }

    function canBePushed(target) {
      return target.kind !== "anchor";
    }

    function pushEnemiesFrom(x, y, radius, force) {
      for (const enemy of getLivingUnits({ faction: "hostile" })) {
        const dx = enemy.x - x;
        const dy = enemy.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance <= radius + enemy.radius) {
          moveWithCollision(enemy, (dx / distance) * force, (dy / distance) * force);
          enemy.hitTimer = 0.08;
        }
      }
    }

    function damageEnemiesInCircle(x, y, radius, damage, element, push = 0, spell = null) {
      let hits = 0;
      for (const target of getDamageableTargets({ element, spell })) {
        const dx = target.x - x;
        const dy = target.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance <= radius + target.radius) {
          const shouldDamage = damage > 0;
          const shouldApplySpell = Boolean(spell?.queue && target.kind === "enemy");
          const shouldPush = push && canBePushed(target);
          if (!shouldDamage && !shouldPush && !shouldApplySpell) {
            continue;
          }
          if (shouldDamage || shouldApplySpell) {
            applySageHit(target, damage, element, spell);
          }
          if (shouldPush) {
            moveWithCollision(target, (dx / distance) * push, (dy / distance) * push);
          }
          hits += 1;
        }
      }
      return hits;
    }

    function damageEnemiesInLine(x, y, angle, range, width, damage, element, push = 0, spell = null) {
      let hits = 0;
      const ax = Math.cos(angle);
      const ay = Math.sin(angle);
      for (const target of getDamageableTargets({ element, spell })) {
        const dx = target.x - x;
        const dy = target.y - y;
        const along = dx * ax + dy * ay;
        if (along < -target.radius || along > range + target.radius) {
          continue;
        }
        const perpendicular = Math.abs(dx * ay - dy * ax);
        if (perpendicular <= width + target.radius) {
          const shouldDamage = damage > 0;
          const shouldApplySpell = Boolean(spell?.queue && target.kind === "enemy");
          const shouldPush = push && canBePushed(target);
          if (!shouldDamage && !shouldPush && !shouldApplySpell) {
            continue;
          }
          if (shouldDamage || shouldApplySpell) {
            applySageHit(target, damage, element, spell);
          }
          if (shouldPush) {
            moveWithCollision(target, ax * push, ay * push);
          }
          hits += 1;
        }
      }
      return hits;
    }

    function damageEnemiesInCone(x, y, angle, range, width, damage, element, push = 0, spell = null) {
      let hits = 0;
      for (const target of getDamageableTargets({ element, spell })) {
        const dx = target.x - x;
        const dy = target.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance > range + target.radius) {
          continue;
        }
        const enemyAngle = Math.atan2(dy, dx);
        const delta = Math.atan2(Math.sin(enemyAngle - angle), Math.cos(enemyAngle - angle));
        if (Math.abs(delta) <= width * 0.5) {
          const shouldDamage = damage > 0;
          const shouldApplySpell = Boolean(spell?.queue && target.kind === "enemy");
          const shouldPush = push && canBePushed(target);
          if (!shouldDamage && !shouldPush && !shouldApplySpell) {
            continue;
          }
          if (shouldDamage || shouldApplySpell) {
            applySageHit(target, damage, element, spell);
          }
          if (shouldPush) {
            moveWithCollision(target, Math.cos(angle) * push, Math.sin(angle) * push);
          }
          hits += 1;
        }
      }
      return hits;
    }

    function damageEnemiesInLightningArc(x, y, angle, range, width, damage, maxTargets, push = 0, spell = null) {
      const candidates = [];
      for (const enemy of getDamageableTargets({ element: "lightning", spell })) {
        const dx = enemy.x - x;
        const dy = enemy.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance > range + enemy.radius) {
          continue;
        }
        const enemyAngle = Math.atan2(dy, dx);
        const delta = Math.abs(Math.atan2(Math.sin(enemyAngle - angle), Math.cos(enemyAngle - angle)));
        if (delta <= width * 0.5) {
          candidates.push({ enemy, distance, delta });
        }
      }
      candidates.sort((a, b) => a.distance - b.distance || a.delta - b.delta);
      const targets = [];
      const selected = new Set();
      if (candidates.length) {
        targets.push(candidates[0].enemy);
        selected.add(candidates[0].enemy);
      }
      while (targets.length && targets.length < maxTargets) {
        const last = targets[targets.length - 1];
        let next = null;
        let bestDistance = Infinity;
        for (const enemy of getDamageableTargets({ element: "lightning", spell })) {
          if (selected.has(enemy)) {
            continue;
          }
          const fromLast = Math.hypot(enemy.x - last.x, enemy.y - last.y);
          const fromCaster = Math.hypot(enemy.x - x, enemy.y - y);
          if (fromLast <= 132 && fromCaster <= range + 156 && fromLast < bestDistance) {
            next = enemy;
            bestDistance = fromLast;
          }
        }
        if (!next) {
          break;
        }
        targets.push(next);
        selected.add(next);
      }
      for (const enemy of targets) {
        applySageHit(enemy, damage, "lightning", spell);
        if (push && canBePushed(enemy)) {
          const dx = enemy.x - x;
          const dy = enemy.y - y;
          const distance = Math.hypot(dx, dy) || 1;
          moveWithCollision(enemy, (dx / distance) * push, (dy / distance) * push);
        }
      }
      return { hits: targets.length, targets };
    }

    function addHazard(config) {
      state.hazards.push({
        x: config.x,
        y: config.y,
        radius: config.radius,
        damage: config.damage || 0,
        element: config.element || "arcane",
        color: config.color || ELEMENT_COLORS.arcane,
        kind: config.kind || "rune",
        life: config.life || 4,
        maxLife: config.life || 4,
        tickRate: config.tickRate || 0.5,
        tickTimer: config.tickRate || 0.5,
        push: config.push || 0,
        sageQueue: config.sageQueue ? [...config.sageQueue] : null
      });
    }

    function createSageProjectile(angle, queue, damage, speed, radius, options = {}) {
      const element = getSageDamageElement(queue);
      state.projectiles.push({
        x: state.player.x + Math.cos(angle) * 22,
        y: state.player.y + Math.sin(angle) * 22,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius,
        damage,
        element,
        kind: options.kind || "sageShard",
        angle,
        spin: Math.random() * TAU,
        life: options.life || 1.1,
        color: options.color || getSageColor(queue),
        pierce: options.pierce || 0,
        splashRadius: options.splashRadius || 0,
        push: options.push || 0,
        sageQueue: [...queue],
        hitTargets: new Set()
      });
    }

    function castSageWind(method) {
      const player = state.player;
      const angle = getAimAngle();
      if (method === "self") {
        player.dashCooldown = 0;
        pushEnemiesFrom(player.x, player.y, 155, 42);
        addEffect(player.x, player.y - 28, "Staff Focus", ELEMENT_COLORS.wind);
      } else if (method === "rune") {
        const target = getSageTargetPoint(184, 8);
        addHazard({ x: target.x, y: target.y, radius: 88, damage: 0, element: "wind", color: ELEMENT_COLORS.wind, kind: "gust", life: 5, tickRate: 0.35, push: 34 });
        addEffect(target.x, target.y - 22, "Gust Rune", ELEMENT_COLORS.wind);
      } else {
        if (method === "area") {
          pushEnemiesFrom(player.x, player.y, 220, 58);
          state.effects.push({ kind: "nova", x: player.x, y: player.y, range: 220, life: 0.2, maxLife: 0.2, color: "rgba(216, 247, 255, 0.28)" });
        } else {
          damageEnemiesInCone(player.x, player.y, angle, 190, 1.05, 0, "wind", 54);
          state.effects.push({ kind: "cone", x: player.x, y: player.y, angle, range: 190, width: 1.05, life: 0.14, maxLife: 0.14, color: "rgba(216, 247, 255, 0.26)" });
        }
      }
    }

    function castSageShield(method, queue, power) {
      const player = state.player;
      const color = getSageColor(queue);
      const element = getSageDamageElement(queue);
      const hasProjectile = hasAny(queue, ["earth", "ice"]);
      const hasBeamOrSpray = hasAny(queue, ["life", "light", "arcane", "fire", "cold", "steam", "lightning", "poison"]);
      const barrierPush = addWaterPush(queue, 42);
      if (method === "self") {
        if (hasProjectile) {
          player.shell += Math.round(70 + power * 1.15 + countAny(queue, ["earth", "ice"]) * 28);
          player.bodyShield = Math.max(player.bodyShield, 7 + countAny(queue, ["earth", "ice"]) * 1.2);
          addEffect(player.x, player.y - 34, "Body Shield", color);
        } else {
          player.shell += Math.round(36 + power * 0.45 + countElement(queue, "shield") * 18);
        }
        if (hasBeamOrSpray) {
          if (queue.includes("arcane") || queue.includes("poison")) player.wards.dark = Math.max(player.wards.dark || 0, 8);
          if (queue.includes("life")) player.wards.life = Math.max(player.wards.life || 0, 8);
          if (queue.includes("light")) player.wards.holy = Math.max(player.wards.holy || 0, 8);
          if (queue.includes("fire") || queue.includes("steam")) player.wards.fire = Math.max(player.wards.fire || 0, 8);
          if (queue.includes("water") || queue.includes("cold") || queue.includes("ice")) player.wards.water = Math.max(player.wards.water || 0, 8);
          if (queue.includes("lightning")) player.wards.lightning = Math.max(player.wards.lightning || 0, 8);
        }
        if (!hasProjectile) {
          addEffect(player.x, player.y - 34, "Ward", color);
        }
        return;
      }
      if (method === "area") {
        const radius = getSageRadius(queue, 128);
        addHazard({ x: player.x, y: player.y, radius, damage: hasBeamOrSpray ? power * 0.28 : 0, element, color, kind: "barrierRing", life: 6, tickRate: 0.24, push: barrierPush, sageQueue: queue });
        state.effects.push({ kind: "nova", x: player.x, y: player.y, range: radius, life: 0.24, maxLife: 0.24, color: getSageEffectColor(queue, 0.2) });
        return;
      }
      if (method === "rune") {
        const target = getSageTargetPoint(172, 12);
        const mines = 2 + Math.min(3, countElement(queue, "shield") + Math.floor(queue.length * 0.4));
        for (let index = 0; index < mines; index += 1) {
          const spread = (index - (mines - 1) * 0.5) * 36;
          addHazard({
            x: target.x + Math.cos(index * 2.4) * spread,
            y: target.y + Math.sin(index * 2.4) * spread,
            radius: getSageRadius(queue, 54),
            damage: hasProjectile || hasBeamOrSpray ? power * 1.05 : 0,
            element,
            color,
            kind: "mine",
            life: 14,
            tickRate: 0.2,
            push: addWaterPush(queue, hasProjectile ? 42 : 22),
            sageQueue: queue
          });
        }
        addEffect(target.x, target.y - 24, "Runic Mine", color);
        return;
      }
      const angle = getAimAngle();
      const center = getSageTargetPoint(136, 14);
      const wallCount = 5 + Math.min(4, countElement(queue, "shield"));
      for (let index = 0; index < wallCount; index += 1) {
        const offset = index - (wallCount - 1) * 0.5;
        const wallAngle = angle + Math.PI * 0.5;
        addHazard({
          x: center.x + Math.cos(wallAngle) * offset * 36,
          y: center.y + Math.sin(wallAngle) * offset * 36,
          radius: 38 + countElement(queue, "shield") * 5,
          damage: hasBeamOrSpray ? power * 0.2 : 0,
          element,
          color,
          kind: "barrier",
          life: 6,
          tickRate: 0.26,
          push: addWaterPush(queue, hasProjectile ? 46 : 32),
          sageQueue: queue
        });
      }
      addEffect(center.x, center.y - 24, "Barrier", color);
    }

    function castSageProjectileSpell(method, queue, power) {
      const player = state.player;
      const angle = getAimAngle();
      const color = getSageColor(queue);
      const element = getSageDamageElement(queue);
      if (method === "self") {
        player.shell += Math.round(44 + power * (queue.includes("earth") ? 0.9 : 0.45));
        player.bodyShield = Math.max(player.bodyShield, 4 + countAny(queue, ["earth", "ice"]));
        if (queue.includes("ice")) player.wards.water = Math.max(player.wards.water || 0, 6);
        addEffect(player.x, player.y - 34, queue.includes("earth") ? "Stone Shell" : "Ice Guard", color);
      } else if (method === "area") {
        const maxRadius = Math.min(canvas.width / DPR, canvas.height / DPR) * 0.48;
        const radius = Math.min(maxRadius, getSageRadius(queue, 126) + countAny(queue, ["earth", "ice"]) * 34);
        const hits = damageEnemiesInCircle(player.x, player.y, radius, power * 0.95, "physical", addWaterPush(queue, 58), sageSpell(queue));
        const sprayCount = countAny(queue, ["fire", "cold", "steam", "poison"]);
        if (sprayCount) {
          damageEnemiesInCircle(player.x, player.y, radius * 0.92, power * 0.24 * sprayCount, getSageDamageElement(queue), 8, sageSpell(queue));
        }
        state.effects.push({ kind: "nova", x: player.x, y: player.y, range: radius, life: 0.26, maxLife: 0.26, color: getSageEffectColor(queue, 0.24) });
        addEffect(player.x, player.y - 34, `${hits} quaked`, color);
      } else if (method === "rune") {
        const target = getSageTargetPoint(190, 10);
        addHazard({ x: target.x, y: target.y, radius: getSageRadius(queue, 70), damage: power * 0.9, element, color, kind: "rune", life: 7, tickRate: 0.65, push: addWaterPush(queue, queue.includes("earth") ? 34 : 18), sageQueue: queue });
      } else {
        const projectileCount = countAny(queue, ["earth", "ice"]);
        if (method === "fissure" && projectileCount > 0) {
          const range = 276 + queue.length * 30 + projectileCount * 26;
          const visualWidth = 78 + queue.length * 4 + projectileCount * 3;
          const hitWidth = visualWidth * 0.5;
          const push = addWaterPush(queue, queue.includes("arcane") ? 52 : 34);
          const hits = damageEnemiesInLine(player.x, player.y, angle, range, hitWidth, power * (0.92 + projectileCount * 0.12), "physical", push, sageSpell(queue));
          state.effects.push({ kind: "fissure", x: player.x, y: player.y, angle, range, width: visualWidth, life: 0.22, maxLife: 0.22, color: getSageEffectColor(queue, 0.26) });
          addEffect(player.x + Math.cos(angle) * Math.min(range, 190), player.y + Math.sin(angle) * Math.min(range, 190), `${hits} fissured`, color);
          return;
        }
        createSageProjectile(angle, queue, power * 1.25, queue.includes("earth") ? 390 : 500, queue.includes("earth") ? 13 : queue.includes("ice") ? 10 : 9, { kind: "sageShard", color, pierce: 2, splashRadius: queue.includes("earth") ? 44 : queue.includes("ice") ? 34 : 26, push: addWaterPush(queue, queue.includes("earth") ? 42 : 28) });
      }
    }

    function castSageBeam(method, queue, power) {
      const player = state.player;
      const angle = getAimAngle();
      const color = getSageColor(queue);
      const element = getSageDamageElement(queue);
      if (method === "self") {
        if (queue.includes("life")) {
          if (player.bodyShield > 0) {
            addEffect(player.x, player.y - 34, "Shell Blocks Healing", "#ff668a");
          } else {
            player.hp = Math.min(player.maxHp, player.hp + Math.round(45 + power));
            addEffect(player.x, player.y - 34, "Mend", ELEMENT_COLORS.life);
          }
        } else if (queue.includes("light")) {
          player.wards.holy = Math.max(player.wards.holy || 0, 8);
          addEffect(player.x, player.y - 34, "Light Ward", ELEMENT_COLORS.light);
        } else {
          player.wards.dark = Math.max(player.wards.dark || 0, 8);
          addEffect(player.x, player.y - 34, "Dark Ward", ELEMENT_COLORS.arcane);
        }
        return;
      }
      if (method === "area") {
        const hits = damageEnemiesInCircle(player.x, player.y, getSageRadius(queue, 150), power * 0.85, element, addWaterPush(queue, 16), sageSpell(queue));
        state.effects.push({ kind: "nova", x: player.x, y: player.y, range: getSageRadius(queue, 150), life: 0.22, maxLife: 0.22, color: getSageEffectColor(queue, 0.24) });
        addEffect(player.x, player.y - 34, `${hits} touched`, color);
      } else if (method === "rune") {
        const target = getSageTargetPoint(190, 10);
        addHazard({ x: target.x, y: target.y, radius: getSageRadius(queue, 92), damage: power * 0.55, element, color, kind: queue.includes("life") || queue.includes("light") ? "sanctum" : "rune", life: 6, tickRate: 0.38, push: addWaterPush(queue, 6), sageQueue: queue });
      } else {
        damageEnemiesInLine(player.x, player.y, angle, 520 + queue.length * 55, 20 + queue.length * 3, power, element, addWaterPush(queue, queue.includes("arcane") ? 20 : 0), sageSpell(queue));
        state.effects.push({ kind: "beam", x: player.x, y: player.y, angle, range: 520 + queue.length * 55, width: 10 + queue.length * 2, life: 0.14, maxLife: 0.14, color });
      }
    }

    function castSageSpray(method, queue, power) {
      const player = state.player;
      const angle = getAimAngle();
      const color = getSageColor(queue);
      const element = getSageDamageElement(queue);
      const dominantCount = getDominantElementCount(queue);
      const pureWater = isPureWaterQueue(queue);
      const push = pureWater ? getPureWaterPush(queue) : addWaterPush(queue, queue.includes("steam") ? 18 + dominantCount * 8 : 8);
      if (method === "self") {
        player.wards[element] = Math.max(player.wards[element] || 0, 6);
        addEffect(player.x, player.y - 34, `${SAGE_ELEMENT_DEFS[queue[0]]?.label || "Element"} Ward`, color);
      } else if (method === "area") {
        const hits = damageEnemiesInCircle(player.x, player.y, getSageRadius(queue, 130), pureWater ? 0 : power * 0.7, element, push, sageSpell(queue));
        state.effects.push({ kind: "nova", x: player.x, y: player.y, range: getSageRadius(queue, 130), life: 0.2, maxLife: 0.2, color: getSageEffectColor(queue, 0.22) });
        addEffect(player.x, player.y - 34, pureWater ? `${hits} pushed` : `${hits} sprayed`, color);
      } else if (method === "rune") {
        const target = getSageTargetPoint(176, 10);
        addHazard({ x: target.x, y: target.y, radius: getSageRadius(queue, 82), damage: pureWater ? 0 : power * 0.42, element, color, kind: "field", life: 5.5, tickRate: 0.32, push, sageQueue: queue });
      } else if (isLightningSpellQueue(queue)) {
        const range = 360 + dominantCount * 42;
        const width = 0.38 + Math.min(0.2, dominantCount * 0.035);
        const result = damageEnemiesInLightningArc(player.x, player.y, angle, range, width, power * (0.42 + dominantCount * 0.08), 2 + dominantCount, 6, sageSpell(queue));
        if (result.targets.length) {
          state.effects.push({ kind: "lightningArc", x: player.x, y: player.y, points: [{ x: player.x, y: player.y }, ...result.targets.map((target) => ({ x: target.x, y: target.y }))], life: 0.12, maxLife: 0.12, color: ELEMENT_COLORS.lightning, width: 3 + dominantCount * 0.4 });
        } else {
          state.effects.push({ kind: "beam", x: player.x, y: player.y, angle, range, width: 5 + dominantCount, life: 0.08, maxLife: 0.08, color: ELEMENT_COLORS.lightning });
        }
      } else {
        const range = 170 + queue.length * 24 + dominantCount * 34;
        const width = 0.72 + Math.min(0.75, queue.length * 0.08);
        const hits = damageEnemiesInCone(player.x, player.y, angle, range, width, pureWater ? 0 : power * (0.54 + dominantCount * 0.14), element, push, sageSpell(queue));
        state.effects.push({ kind: "cone", x: player.x, y: player.y, angle, range, width, life: 0.14, maxLife: 0.14, color: getSageEffectColor(queue, 0.28) });
        addEffect(player.x + Math.cos(angle) * 70, player.y + Math.sin(angle) * 70, pureWater ? `${hits} pushed` : `${hits} sprayed`, color);
      }
    }

    function shouldChannelSageSpell(method, queue) {
      if (method !== "direct" || !queue.length || !isSageDirectCastHeld(queue)) {
        return false;
      }
      if (getSageComboSpellKey(queue)) {
        return false;
      }
      const manifestation = getSageManifestation(queue);
      return manifestation === "beam" || manifestation === "spray" || manifestation === "lightning";
    }

    function startSageChannel(queue) {
      const manifestation = getSageManifestation(queue);
      state.sageChannel = {
        queue: [...queue],
        manifestation,
        life: 0,
        tickTimer: 0,
        effectTimer: 0
      };
      if (manifestation === "beam" || manifestation === "lightning") {
        startSfxLoop("sage-channel", SFX_TRACKS.laserLoop, 0.12);
      }
      clearSageQueue(`${manifestation === "lightning" ? "Lightning" : manifestation === "beam" ? "Beam" : "Spray"} channeling.`);
    }

    function stopSageChannel() {
      if (state.sageChannel) {
        state.sageChannel = null;
        state.sageMessage = "Channel released.";
      }
      stopSfxLoop("sage-channel");
    }

    function updateSageChannel(dt) {
      const channel = state.sageChannel;
      if (!channel || !isSageDirectCastHeld(channel.queue) || !isSage()) {
        stopSageChannel();
        return;
      }
      const player = state.player;
      const queue = channel.queue;
      channel.life += dt;
      channel.effectTimer -= dt;
      channel.tickTimer -= dt;
      const angle = getAimAngle();
      const power = getSagePower(queue);
      const element = getSageDamageElement(queue);
      const color = getSageColor(queue);
      const spell = sageSpell(queue);
      if (channel.manifestation === "beam") {
        const range = 520 + queue.length * 58;
        const width = 18 + queue.length * 3;
        damageEnemiesInLine(player.x, player.y, angle, range, width, power * 2.1 * dt, element, 0, spell);
        if (channel.effectTimer <= 0) {
          channel.effectTimer = 0.045;
          state.effects.push({ kind: "beam", x: player.x, y: player.y, angle, range, width: Math.max(8, width * 0.42), life: 0.08, maxLife: 0.08, color });
        }
      } else if (channel.manifestation === "lightning") {
        const lightningCount = Math.max(1, countElement(queue, "lightning"));
        const range = 380 + lightningCount * 46;
        const width = 0.36 + Math.min(0.2, lightningCount * 0.035);
        if (channel.tickTimer <= 0) {
          channel.tickTimer = 0.18;
          const result = damageEnemiesInLightningArc(player.x, player.y, angle, range, width, power * (0.38 + lightningCount * 0.075), 2 + lightningCount, 5, spell);
          if (result.targets.length) {
            state.effects.push({ kind: "lightningArc", x: player.x, y: player.y, points: [{ x: player.x, y: player.y }, ...result.targets.map((target) => ({ x: target.x, y: target.y }))], life: 0.12, maxLife: 0.12, color: ELEMENT_COLORS.lightning, width: 2.8 + lightningCount * 0.35 });
          }
        }
        if (channel.effectTimer <= 0) {
          channel.effectTimer = 0.05;
          state.effects.push({ kind: "beam", x: player.x, y: player.y, angle, range, width: 4 + lightningCount * 0.8, life: 0.07, maxLife: 0.07, color: ELEMENT_COLORS.lightning });
        }
      } else {
        const dominantCount = getDominantElementCount(queue);
        const range = 185 + queue.length * 28 + dominantCount * 42;
        const width = 0.78 + Math.min(0.85, queue.length * 0.09);
        const pureWater = isPureWaterQueue(queue);
        const push = pureWater ? getPureWaterPush(queue) : addWaterPush(queue, queue.includes("steam") ? 20 + dominantCount * 9 : 8);
        damageEnemiesInCone(player.x, player.y, angle, range, width, pureWater ? 0 : power * (1.28 + dominantCount * 0.22) * dt, element, push * dt * 10, spell);
        if (channel.effectTimer <= 0) {
          channel.effectTimer = 0.055;
          state.effects.push({ kind: "cone", x: player.x, y: player.y, angle, range, width, life: 0.09, maxLife: 0.09, color: getSageEffectColor(queue, 0.24) });
        }
      }
    }

    function updateSageMouseCasting(dt) {
      if (state.sageChannel) {
        updateSageChannel(dt);
        return;
      }
      const queue = [...state.sageQueue];
      if (!isSageDirectCastHeld(queue)) {
        return;
      }
      const method = mouse.down && mouse.altDirect && hasAny(queue, ["earth", "ice"]) ? "fissure" : "direct";
      if (shouldChannelSageSpell(method, queue)) {
        startSageChannel(queue);
        updateSageChannel(dt);
        return;
      }
      if (!isSageDirectCastPressed(queue)) {
        return;
      }
      castSageSpell(method);
    }

    function castSageSpell(method) {
      if (!isSage()) {
        return false;
      }
      if (state.screen !== "play") {
        state.sageMessage = "Spellcraft waits beyond the gate.";
        return false;
      }
      const player = state.player;
      const queue = [...state.sageQueue];
      const comboKey = getSageComboSpellKey(queue);
      if (player.invisible && comboKey !== "invisibility") {
        breakInvisibility("Revealed");
      }
      if (shouldChannelSageSpell(method, queue)) {
        startSageChannel(queue);
        return true;
      }
      if (!queue.length) {
        if (player.windTimer > 0) {
          return true;
        }
        player.windTimer = 0.55;
      }
      if (!queue.length) {
        castSageWind(method);
      } else {
        if (castSageComboSpell(method, queue)) {
          clearSageQueue(state.sageMessage);
          return true;
        }
        const power = getSagePower(queue);
        const manifestation = getSageManifestation(queue);
        if (manifestation === "shield") {
          castSageShield(method, queue, power);
        } else if (manifestation === "projectile") {
          castSageProjectileSpell(method, queue, power);
        } else if (manifestation === "beam") {
          castSageBeam(method, queue, power);
        } else {
          castSageSpray(method, queue, power);
        }
      }
      clearSageQueue(`${method[0].toUpperCase()}${method.slice(1)} spell cast.`);
      return true;
    }

    function fireBolt() {
      if (castSageSpell("direct")) {
        return;
      }
      const player = state.player;
      if (player.attackTimer > 0) {
        return;
      }
      const classDef = getClassDef();
      const derived = getDerivedStats();
      const angle = getAimAngle();
      if (isPojo()) {
        state.projectiles.push({
          x: player.x + Math.cos(angle) * 20,
          y: player.y + Math.sin(angle) * 20,
          vx: Math.cos(angle) * 560,
          vy: Math.sin(angle) * 560,
          radius: 6,
          damage: derived.spellDamage * 0.82,
          element: "fire",
          kind: "fireball",
          angle,
          spin: Math.random() * TAU,
          life: 0.95,
          color: ELEMENT_COLORS.fire
        });
        player.attackTimer = derived.attackCooldown;
        return;
      }
      const speed = state.classKey === "archer" ? 650 : 560;
      const damage = state.classKey === "mage" ? derived.spellDamage * 0.82 : derived.weaponDamage;
      state.projectiles.push({
        x: player.x + Math.cos(angle) * 20,
        y: player.y + Math.sin(angle) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: state.classKey === "mage" ? 6 : 5,
        damage,
        element: classDef.attackElement,
        kind: state.classKey === "warrior" ? "axe" : state.classKey === "archer" ? "arrow" : "fireball",
        angle,
        spin: Math.random() * TAU,
        life: state.classKey === "archer" ? 1.15 : 0.95,
        color: ELEMENT_COLORS[classDef.attackElement] || "#63f0c4"
      });
      player.attackTimer = derived.attackCooldown;
    }

    function castCleave() {
      if (castSageSpell("area")) {
        return;
      }
      const player = state.player;
      const classDef = getClassDef();
      const derived = getDerivedStats();
      if (player.skillTimer > 0) {
        return;
      }
      if (isPojo()) {
        const angle = getAimAngle();
        const range = 245 + player.stats.intelligence * 5;
        const width = 1.18;
        const damage = derived.spellDamage * 1.9;
        player.skillTimer = 3.1;
        const hitCount = damageEnemiesInCone(player.x, player.y, angle, range, width, damage, "fire", 26);
        state.effects.push({
          kind: "cone",
          x: player.x,
          y: player.y,
          angle,
          range,
          width,
          life: 0.22,
          maxLife: 0.22,
          color: "rgba(255, 93, 61, 0.34)"
        });
        if (hitCount) {
          addEffect(player.x, player.y - 34, `${hitCount} burned`, ELEMENT_COLORS.fire);
        }
        return;
      }
      player.skillTimer = state.classKey === "mage" ? 3.7 : state.classKey === "archer" ? 3.4 : 4.2;
      const angle = getAimAngle();
      const range = state.classKey === "archer" ? 270 : state.classKey === "mage" ? 154 : 132;
      const width = state.classKey === "archer" ? 0.58 : 1.45;
      const skillDamage = state.classKey === "warrior" ? derived.weaponDamage * 2.55 : derived.spellDamage * 2.05;
      let hitCount = 0;

      for (const enemy of getLivingUnits({ faction: "hostile" })) {
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.hypot(dx, dy);
        if (distance > range + enemy.radius) {
          continue;
        }
        if (state.classKey === "mage") {
          applyDamage(enemy, skillDamage, classDef.skillElement);
          hitCount += 1;
        } else {
          const enemyAngle = Math.atan2(dy, dx);
          const delta = Math.atan2(Math.sin(enemyAngle - angle), Math.cos(enemyAngle - angle));
          if (Math.abs(delta) <= width * 0.5) {
            applyDamage(enemy, skillDamage, classDef.skillElement);
            hitCount += 1;
          }
        }
      }

      state.effects.push({
        kind: state.classKey === "mage" ? "nova" : "cleave",
        x: player.x,
        y: player.y,
        angle,
        range,
        width,
        life: 0.18,
        maxLife: 0.18,
        color: state.classKey === "mage" ? "rgba(196, 130, 255, 0.32)" : "rgba(99, 240, 196, 0.34)"
      });
      if (hitCount) {
        addEffect(player.x, player.y - 34, `${hitCount} hit`, ELEMENT_COLORS[classDef.skillElement] || "#63f0c4");
      }
    }

    function dash() {
      const player = state.player;
      if (state.classKey === "sage") {
        state.sageMessage = "Haste is Lightning + Arcane + Fire, then Direct Cast.";
        return;
      }
      if (player.dashCooldown > 0) {
        return;
      }
      const angle = getAimAngle();
      const derived = getDerivedStats();
      player.dashHits.clear();
      if (state.classKey === "mage") {
        const fromX = player.x;
        const fromY = player.y;
        const destination = findBlinkDestination(angle, 330 + player.stats.intelligence * 6);
        player.x = destination.x;
        player.y = destination.y;
        player.dashTimer = 0.08;
        player.dashCooldown = Math.max(1.7, derived.dashCooldown + 0.25);
        addEffect(fromX, fromY - 20, "Blink", ELEMENT_COLORS.arcane);
        addEffect(player.x, player.y - 20, "Blink", ELEMENT_COLORS.arcane);
        return;
      }
      if (isPojo()) {
        player.dashTimer = 0.18;
        player.dashVx = Math.cos(angle) * 590;
        player.dashVy = Math.sin(angle) * 590;
        player.dashCooldown = Math.max(1.15, derived.dashCooldown - 0.2);
        addEffect(player.x, player.y - 26, "Flutter", ELEMENT_COLORS.fire);
        return;
      }
      const backward = state.classKey === "archer";
      const moveAngle = backward ? angle + Math.PI : angle;
      player.dashTimer = backward ? 0.2 : 0.28;
      player.dashVx = Math.cos(moveAngle) * (backward ? 680 : 610);
      player.dashVy = Math.sin(moveAngle) * (backward ? 680 : 610);
      player.dashCooldown = backward ? Math.max(1.25, derived.dashCooldown - 0.15) : Math.max(1.9, derived.dashCooldown + 0.15);
      addEffect(player.x, player.y - 26, backward ? "Disengage" : "Charge", backward ? "#63f0c4" : "#f7cc78");
    }

    function isNormalAttackHeld() {
      return mouse.down || (!isSage() && (gamepadButtonDown(GAMEPAD_BUTTON.A) || gamepadButtonDown(GAMEPAD_BUTTON.X)));
    }

    function isSageControllerDirectCastHeld(queue = state.sageQueue) {
      return isSage()
        && gamepadInput.connected
        && gamepadInput.aimActive
        && (queue.length > 0 || Boolean(state.sageChannel));
    }

    function isSageControllerDirectCastPressed(queue = state.sageQueue) {
      return isSageControllerDirectCastHeld(queue) && !gamepadInput.prevAimActive && queue.length > 0;
    }

    function isSageDirectCastHeld(queue = state.sageQueue) {
      return mouse.down || isSageControllerDirectCastHeld(queue);
    }

    function isSageDirectCastPressed(queue = state.sageQueue) {
      return mouse.pressed || isSageControllerDirectCastPressed(queue);
    }

    function castSageQueuedComboSpell() {
      const queue = [...state.sageQueue];
      if (!queue.length) {
        return false;
      }
      if (!castSageComboSpell("direct", queue)) {
        state.sageMessage = "RT activates combo spells. Use the right stick for forward casts.";
        return false;
      }
      clearSageQueue(state.sageMessage);
      return true;
    }

    function queueSageGamepadElement(buttonIndex, normalElement, modifiedElement) {
      if (!gamepadButtonPressed(buttonIndex)) {
        return;
      }
      queueSageElement(gamepadButtonDown(GAMEPAD_BUTTON.LB) ? modifiedElement : normalElement);
    }

    function handleGamepadActions() {
      if (!gamepadInput.connected || state.screen !== "play") {
        return;
      }
      if (isSage()) {
        queueSageGamepadElement(GAMEPAD_BUTTON.A, "fire", "cold");
        queueSageGamepadElement(GAMEPAD_BUTTON.X, "lightning", "water");
        queueSageGamepadElement(GAMEPAD_BUTTON.B, "earth", "shield");
        queueSageGamepadElement(GAMEPAD_BUTTON.Y, "arcane", "life");
        if (gamepadButtonPressed(GAMEPAD_BUTTON.LT)) {
          castSageSpell("area");
        }
        if (gamepadButtonPressed(GAMEPAD_BUTTON.RB)) {
          castSageSpell("self");
        }
        if (gamepadButtonPressed(GAMEPAD_BUTTON.RT)) {
          castSageQueuedComboSpell();
        }
        return;
      }
      if (gamepadButtonPressed(GAMEPAD_BUTTON.RT)) {
        dash();
      }
      if (gamepadButtonPressed(GAMEPAD_BUTTON.RB)) {
        castCleave();
      }
    }

    function updatePlayer(dt) {
      const player = state.player;
      const derived = getDerivedStats();
      const move = getMoveVector();
      if (player.dashTimer > 0 && state.classKey !== "mage") {
        moveWithCollision(player, player.dashVx * dt, player.dashVy * dt);
        if (state.classKey === "warrior") {
          for (const enemy of getLivingUnits({ faction: "hostile" })) {
            if (player.dashHits.has(enemy)) {
              continue;
            }
            if (distanceSquared(player.x, player.y, enemy.x, enemy.y) <= (player.radius + enemy.radius + 8) ** 2) {
              applyDamage(enemy, derived.weaponDamage * 2.7, "physical");
              player.dashHits.add(enemy);
            }
          }
        }
      } else if (move.active) {
        const bodyShieldSlow = player.bodyShield > 0 ? 0.58 : 1;
        const hasteBoost = isSage() && player.hasteTimer > 0 ? 1.5 : 1;
        const performanceBoost = player.performanceTimer > 0 ? 1.77 : 1;
        moveWithCollision(player, move.x * player.speed * bodyShieldSlow * hasteBoost * performanceBoost * dt, move.y * player.speed * bodyShieldSlow * hasteBoost * performanceBoost * dt);
      }
      if (isSage()) {
        updateSageMouseCasting(dt);
      } else if (isNormalAttackHeld()) {
        fireBolt();
      }
      player.attackTimer = Math.max(0, player.attackTimer - dt);
      player.skillTimer = Math.max(0, player.skillTimer - dt);
      player.windTimer = Math.max(0, player.windTimer - dt);
      player.hasteTimer = Math.max(0, player.hasteTimer - dt);
      player.performanceTimer = Math.max(0, player.performanceTimer - dt);
      player.dashTimer = Math.max(0, player.dashTimer - dt);
      player.dashCooldown = Math.max(0, player.dashCooldown - dt);
      if (player.dashTimer <= 0) {
        player.dashVx = 0;
        player.dashVy = 0;
      }
      player.bodyShield = Math.max(0, player.bodyShield - dt);
      for (const element of Object.keys(player.wards)) {
        player.wards[element] = Math.max(0, player.wards[element] - dt);
        if (player.wards[element] <= 0) {
          delete player.wards[element];
        }
      }
      state.nearShop = distanceSquared(player.x, player.y, SHOP_ZONE.x, SHOP_ZONE.y) <= (SHOP_ZONE.radius + player.radius) ** 2;
      state.camera.x = clamp(player.x - canvas.width / DPR * 0.5, 0, WORLD_W - canvas.width / DPR);
      state.camera.y = clamp(player.y - canvas.height / DPR * 0.5, 0, WORLD_H - canvas.height / DPR);
      const floorDef = getFloorDef();
      if (state.floorClear && floorDef.exitPortal && distanceSquared(player.x, player.y, floorDef.exitPortal.x, floorDef.exitPortal.y) <= (floorDef.exitPortal.radius + player.radius) ** 2) {
        playSfx("portal", { volume: 0.34, throttle: 0.6 });
        openRealmHub();
      }
    }

    function updateHub(dt) {
      const player = state.player;
      const move = getMoveVector();
      if (move.active) {
        moveWithCollision(player, move.x * player.speed * dt, move.y * player.speed * dt);
      }

      player.attackTimer = Math.max(0, player.attackTimer - dt);
      player.skillTimer = Math.max(0, player.skillTimer - dt);
      player.windTimer = Math.max(0, player.windTimer - dt);
      player.hasteTimer = Math.max(0, player.hasteTimer - dt);
      player.performanceTimer = Math.max(0, player.performanceTimer - dt);
      player.dashTimer = 0;
      player.dashCooldown = 0;
      state.hubPortalCooldown = Math.max(0, state.hubPortalCooldown - dt);
      state.nearShop = distanceSquared(player.x, player.y, HUB_MARKET.x, HUB_MARKET.y) <= (HUB_MARKET.radius + player.radius) ** 2;
      state.camera.x = clamp(player.x - canvas.width / DPR * 0.5, 0, WORLD_W - canvas.width / DPR);
      state.camera.y = clamp(player.y - canvas.height / DPR * 0.5, 0, WORLD_H - canvas.height / DPR);

      if (state.hubPortalCooldown > 0) {
        return;
      }
      for (const portal of HUB_LEVEL_PORTALS) {
        if (distanceSquared(player.x, player.y, portal.x, portal.y) <= (portal.radius + player.radius) ** 2) {
          enterHubLevelPortal(portal);
          return;
        }
      }
    }

    function updateProjectiles(dt) {
      for (let index = state.projectiles.length - 1; index >= 0; index -= 1) {
        const projectile = state.projectiles[index];
        projectile.x += projectile.vx * dt;
        projectile.y += projectile.vy * dt;
        projectile.spin = (projectile.spin || 0) + 12 * dt;
        projectile.life -= dt;

        if (projectile.life <= 0 || circleBlocked(projectile.x, projectile.y, projectile.radius)) {
          state.projectiles.splice(index, 1);
          continue;
        }

        let hit = false;
        for (const enemy of getDamageableTargets({ includeAnchors: false, includeInactive: true, element: projectile.element, spell: projectile.sageQueue ? sageSpell(projectile.sageQueue) : null })) {
          if (projectile.hitTargets?.has(enemy)) {
            continue;
          }
          if (distanceSquared(projectile.x, projectile.y, enemy.x, enemy.y) <= (projectile.radius + enemy.radius) ** 2) {
            projectile.hitTargets?.add(enemy);
            applySageHit(enemy, projectile.damage, projectile.element, projectile.sageQueue ? sageSpell(projectile.sageQueue) : null);
            if (projectile.push) {
              const angle = Math.atan2(enemy.y - projectile.y, enemy.x - projectile.x);
              moveWithCollision(enemy, Math.cos(angle) * projectile.push, Math.sin(angle) * projectile.push);
            }
            if (projectile.splashRadius) {
              damageEnemiesInCircle(projectile.x, projectile.y, projectile.splashRadius, projectile.damage * 0.42, projectile.element, projectile.push * 0.45, projectile.sageQueue ? sageSpell(projectile.sageQueue) : null);
              state.effects.push({ kind: "nova", x: projectile.x, y: projectile.y, range: projectile.splashRadius, life: 0.12, maxLife: 0.12, color: "rgba(247, 204, 120, 0.18)" });
            }
            hit = true;
            break;
          }
        }
        if (hit) {
          if (projectile.pierce > 0) {
            projectile.pierce -= 1;
          } else {
            state.projectiles.splice(index, 1);
          }
        }
      }
    }

    function clearAnchor(index, anchor) {
      addEffect(anchor.x, anchor.y - 36, "Anchor Cleared", "#f7cc78");
      playSfx("quest", { volume: 0.34, throttle: 0.25 });
      state.pickups.push({ type: "gold", x: anchor.x, y: anchor.y, radius: 10, value: 35, color: "#f7cc78" });
      state.anchors.splice(index, 1);
      state.quests.anchorsCleared += 1;
    }

    function updateAnchors(dt) {
      for (let index = state.anchors.length - 1; index >= 0; index -= 1) {
        const anchor = state.anchors[index];
        if (anchor.hp <= 0) {
          clearAnchor(index, anchor);
          continue;
        }
        const floorDef = getFloorDef();
        anchor.spawnTimer -= dt;
        if (anchor.spawnTimer <= 0 && getLivingUnits({ faction: "hostile" }).length < floorDef.enemyCap) {
          anchor.spawnTimer = floorDef.spawnEvery;
          const type = floorDef.anchorTypes[Math.floor(Math.random() * floorDef.anchorTypes.length)];
          spawnEnemyNear(anchor.x, anchor.y, type);
        }

        for (const projectile of state.projectiles) {
          if (distanceSquared(projectile.x, projectile.y, anchor.x, anchor.y) <= (projectile.radius + anchor.radius) ** 2) {
            applySageHit(anchor, projectile.damage, projectile.element, projectile.sageQueue ? sageSpell(projectile.sageQueue) : null);
            projectile.life = 0;
          }
        }
        if (anchor.hp <= 0) {
          clearAnchor(index, anchor);
        }
      }
      if (!state.floorClear && isFloorObjectiveCleared()) {
        completeFloor();
      }
    }

    function defeatEnemy(index, enemy) {
      if (enemy.isBoss) {
        if (enemy.type === "wraith") {
          playSfx("wraith", { volume: 0.36, throttle: 0.5 });
        } else if (enemy.type === "lich" || enemy.type === "demonGodKing") {
          playSfx("death", { volume: 0.33, throttle: 0.5 });
        }
      }
      if (!enemy.minion) {
        state.quests.kills += 1;
        gainXp(enemy.xp);
        dropLoot(enemy.x, enemy.y, enemy);
      }
      state.enemies.splice(index, 1);
    }

    function breakInvisibility(message = "Revealed") {
      const player = state.player;
      if (!player?.invisible) {
        return;
      }
      player.invisible = false;
      addEffect(player.x, player.y - 28, message, ELEMENT_COLORS.arcane);
    }

    function recoverPlayerAtGate(message = "Recovered at Rift Gate") {
      const player = state.player;
      player.hp = player.maxHp;
      player.x = TILE * 4.5;
      player.y = TILE * 4.5;
      state.gold = Math.max(0, state.gold - 15);
      player.invisible = false;
      addEffect(player.x, player.y - 28, message, "#ff668a");
    }

    function damagePlayer(amount, element = "physical") {
      const player = state.player;
      if (amount <= 0) {
        return 0;
      }
      breakInvisibility("Revealed");
      let incoming = amount;
      if (player.performanceTimer > 0) {
        incoming *= 0.45;
      }
      if (player.wards[element]) {
        incoming *= 0.45;
      }
      if (player.bodyShield > 0 && element === "physical") {
        incoming *= 0.55;
      }
      if (player.shell > 0 && element === "physical") {
        const absorbed = Math.min(player.shell, incoming);
        player.shell -= absorbed;
        incoming -= absorbed;
      }
      player.hp -= incoming;
      if (player.hp <= 0) {
        recoverPlayerAtGate();
      }
      return incoming;
    }

    function updateEnemies(dt) {
      const player = state.player;
      for (let index = state.enemies.length - 1; index >= 0; index -= 1) {
        const enemy = state.enemies[index];
        if (enemy.charmTimer > 0) {
          enemy.charmTimer = Math.max(0, enemy.charmTimer - dt);
          if (enemy.charmTimer <= 0 && enemy.charmed) {
            enemy.charmed = false;
            enemy.faction = "hostile";
            enemy.minion = false;
            enemy.color = enemy.baseColor || enemy.color;
            addTargetEffect(enemy, "charm-end", "Charm Ended", "#ff668a", 0.2);
          }
        }
        if (enemy.fearTimer > 0) {
          enemy.fearTimer = Math.max(0, enemy.fearTimer - dt);
        }
        const statusSpeed = updateTargetStatuses(enemy, dt);
        if (enemy.hp <= 0) {
          defeatEnemy(index, enemy);
          continue;
        }
        if (enemy.inactiveElemental) {
          enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
          continue;
        }

        if (isAlliedUnit(enemy)) {
          const target = findNearestUnit(enemy.x, enemy.y, { faction: "hostile" });
          if (target) {
            const dx = target.x - enemy.x;
            const dy = target.y - enemy.y;
            const distance = Math.hypot(dx, dy) || 1;
            if (distance > enemy.radius + target.radius + 3) {
              moveWithCollision(enemy, (dx / distance) * enemy.speed * statusSpeed * dt, (dy / distance) * enemy.speed * statusSpeed * dt);
            } else {
              applyDamage(target, enemy.damage * dt, enemy.damageElement || "physical");
            }
          }
          enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
          if (enemy.hp <= 0) {
            defeatEnemy(index, enemy);
          }
          continue;
        }

        const playerDx = player.x - enemy.x;
        const playerDy = player.y - enemy.y;
        const playerDistance = Math.hypot(playerDx, playerDy) || 1;
        if (enemy.fearTimer > 0) {
          if (playerDistance < 760) {
            moveWithCollision(enemy, (-playerDx / playerDistance) * enemy.speed * statusSpeed * 1.18 * dt, (-playerDy / playerDistance) * enemy.speed * statusSpeed * 1.18 * dt);
          }
          enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);
          continue;
        }

        const allyTarget = findNearestUnit(enemy.x, enemy.y, { faction: "ally" });
        let target = null;
        let targetDistance = Infinity;
        if (allyTarget) {
          target = allyTarget;
          targetDistance = Math.hypot(allyTarget.x - enemy.x, allyTarget.y - enemy.y);
        }
        if (!player.invisible && playerDistance < targetDistance) {
          target = player;
          targetDistance = playerDistance;
        }
        const aggro = target && targetDistance < 620;
        if (aggro) {
          const dx = target.x - enemy.x;
          const dy = target.y - enemy.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance > enemy.radius + target.radius + 3) {
            moveWithCollision(enemy, (dx / distance) * enemy.speed * statusSpeed * dt, (dy / distance) * enemy.speed * statusSpeed * dt);
          }
        }
        enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);

        const afterPlayerDx = player.x - enemy.x;
        const afterPlayerDy = player.y - enemy.y;
        const afterPlayerDistance = Math.hypot(afterPlayerDx, afterPlayerDy) || 1;
        if (afterPlayerDistance < player.radius + enemy.radius + 3) {
          if (player.invisible) {
            breakInvisibility("Revealed");
          } else {
            const classDef = getClassDef();
            const derived = getDerivedStats();
            const guarded = classDef.guardElement === enemy.damageElement;
            damagePlayer(enemy.damage * (1 - derived.defenseReduction) * (guarded ? 1 - classDef.guard : 1) * dt, enemy.damageElement);
          }
        }

        if (allyTarget && distanceSquared(enemy.x, enemy.y, allyTarget.x, allyTarget.y) < (enemy.radius + allyTarget.radius + 3) ** 2) {
          applyDamage(allyTarget, enemy.damage * dt, enemy.damageElement || "physical");
        }

        if (enemy.hp <= 0) {
          defeatEnemy(index, enemy);
        }
      }
      if (!state.floorClear && isFloorObjectiveCleared()) {
        completeFloor();
      }
    }

    function healPlayerFromPickup(pickup) {
      const player = state.player;
      const baseValue = Number(pickup.value) || 0;
      if (pickup.type === "gold") {
        return Math.max(6, Math.round(baseValue * 0.7));
      }
      if (pickup.type === "health") {
        return Math.max(1, Math.round(baseValue));
      }
      return Math.max(8, Math.round(baseValue || 12));
    }

    function collectPickup(pickup) {
      const player = state.player;
      playSfx("pickup", { volume: pickup.type === "health" ? 0.34 : 0.28, throttle: 0.035 });
      if (isPojo()) {
        const healing = healPlayerFromPickup(pickup);
        player.hp = Math.min(player.maxHp, player.hp + healing);
        addEffect(player.x, player.y - 28, `Ate +${healing} HP`, ELEMENT_COLORS.fire);
        return;
      }
      if (pickup.type === "gold") {
        state.gold += pickup.value;
      } else if (pickup.type === "health") {
        if (player.bodyShield > 0) {
          addEffect(player.x, player.y - 30, "Body Shield Blocks Healing", "#ff668a");
        } else {
          player.hp = Math.min(player.maxHp, player.hp + pickup.value);
        }
      }
    }

    function updatePickups(dt) {
      const player = state.player;
      for (let index = state.pickups.length - 1; index >= 0; index -= 1) {
        const pickup = state.pickups[index];
        const dx = player.x - pickup.x;
        const dy = player.y - pickup.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < 150) {
          pickup.x += (dx / distance) * 220 * dt;
          pickup.y += (dy / distance) * 220 * dt;
        }
        if (distance < player.radius + pickup.radius + 6) {
          collectPickup(pickup);
          state.pickups.splice(index, 1);
        }
      }
    }

    function getWorldTimeScale() {
      return state.timeWarpTimer > 0 ? 0.5 : 1;
    }

    function damageUnitsInCircle(x, y, radius, damage, element, options = {}) {
      let hits = 0;
      if (options.includePlayer && state.player) {
        const player = state.player;
        const dx = player.x - x;
        const dy = player.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance <= radius + player.radius) {
          damagePlayer(damage, element);
          if (options.pull) {
            moveWithCollision(player, (-dx / distance) * options.pull, (-dy / distance) * options.pull);
          }
          hits += 1;
        }
      }
      for (const unit of getLivingUnits({ includeInactive: options.includeInactive })) {
        const dx = unit.x - x;
        const dy = unit.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance > radius + unit.radius) {
          continue;
        }
        applyDamage(unit, damage, element);
        if (options.pull && canBePushed(unit)) {
          moveWithCollision(unit, (-dx / distance) * options.pull, (-dy / distance) * options.pull);
        }
        hits += 1;
      }
      return hits;
    }

    function updateRain(dt) {
      if (state.rainTimer <= 0) {
        return;
      }
      state.rainTimer = Math.max(0, state.rainTimer - dt);
      state.rainTickTimer -= dt;
      if (state.rainTickTimer > 0) {
        return;
      }
      state.rainTickTimer = 0.45;
      for (const unit of getLivingUnits({ includeInactive: true })) {
        if (isInScreenBounds(unit, 64)) {
          applyStatus(unit, "wet", 17.5, 2);
        }
      }
      if (state.player && isInScreenBounds(state.player, 64)) {
        state.effects.push({ kind: "nova", x: state.camera.x + canvas.width / DPR * 0.5, y: state.camera.y + canvas.height / DPR * 0.5, range: Math.max(canvas.width / DPR, canvas.height / DPR) * 0.65, life: 0.18, maxLife: 0.18, color: "rgba(75, 217, 255, 0.18)" });
      }
    }

    function updateMeteorShowers(dt) {
      for (let index = state.meteorShowers.length - 1; index >= 0; index -= 1) {
        const shower = state.meteorShowers[index];
        shower.life -= dt;
        shower.nextMeteor -= dt;
        if (shower.nextMeteor <= 0 && shower.life > 0) {
          shower.nextMeteor = 0.5 + Math.random();
          summonMeteorWarning(shower.damage);
        }
        if (shower.life <= 0) {
          state.meteorShowers.splice(index, 1);
        }
      }
    }

    function updateSageWorldSpells(dt) {
      state.timeWarpTimer = Math.max(0, state.timeWarpTimer - dt);
      updateRain(dt);
      updateMeteorShowers(dt);
    }

    function updateHazards(dt) {
      for (let index = state.hazards.length - 1; index >= 0; index -= 1) {
        const hazard = state.hazards[index];
        hazard.life -= dt;
        if (hazard.kind === "meteorWarning") {
          if (hazard.life <= 0) {
            damageUnitsInCircle(hazard.x, hazard.y, hazard.radius, hazard.damage, hazard.element, { includePlayer: true, includeInactive: true });
            state.effects.push({ kind: "meteor", x: hazard.x, y: hazard.y, range: hazard.radius, life: 0.34, maxLife: 0.34, color: "rgba(255, 139, 74, 0.48)" });
            state.hazards.splice(index, 1);
          }
          continue;
        }
        if (hazard.kind === "vortex") {
          const affected = damageUnitsInCircle(hazard.x, hazard.y, hazard.radius, hazard.damage * dt, hazard.element, { includePlayer: true, pull: (hazard.pull || 220) * dt });
          const wasFullSize = hazard.radius >= (hazard.maxRadius || 260) - 2;
          if (affected > 0) {
            hazard.radius = Math.min(hazard.maxRadius || 260, hazard.radius + affected * 7);
            if (hazard.radius >= (hazard.maxRadius || 260) - 2) {
              hazard.reachedFull = true;
            }
            hazard.idleAtFull = 0;
          } else {
            if (wasFullSize || hazard.reachedFull) {
              hazard.idleAtFull = (hazard.idleAtFull || 0) + dt;
            }
            hazard.radius = Math.max(42, hazard.radius - 12 * dt);
          }
          if (hazard.radius <= 44 || (hazard.idleAtFull || 0) >= 10) {
            state.hazards.splice(index, 1);
          }
          continue;
        }
        if (hazard.kind === "mine") {
          const triggered = getDamageableTargets().some((target) => distanceSquared(hazard.x, hazard.y, target.x, target.y) <= (hazard.radius + target.radius) ** 2);
          if (triggered || hazard.life <= 0) {
            damageEnemiesInCircle(hazard.x, hazard.y, hazard.radius + 18, hazard.damage, hazard.element, hazard.push + 20, hazard.sageQueue ? sageSpell(hazard.sageQueue) : null);
            state.effects.push({ kind: "nova", x: hazard.x, y: hazard.y, range: hazard.radius + 18, life: 0.18, maxLife: 0.18, color: "rgba(247, 204, 120, 0.25)" });
            state.hazards.splice(index, 1);
          }
          continue;
        }
        hazard.tickTimer -= dt;
        if (hazard.tickTimer <= 0) {
          hazard.tickTimer = hazard.tickRate;
          const spell = hazard.sageQueue ? sageSpell(hazard.sageQueue) : null;
          if (hazard.damage > 0 || spell) {
            damageEnemiesInCircle(hazard.x, hazard.y, hazard.radius, hazard.damage, hazard.element, hazard.push, spell);
          } else if (hazard.push) {
            pushEnemiesFrom(hazard.x, hazard.y, hazard.radius, hazard.push);
          }
        }
        if (hazard.life <= 0) {
          state.hazards.splice(index, 1);
        }
      }
    }

    function updateEffects(dt) {
      for (let index = state.effects.length - 1; index >= 0; index -= 1) {
        const effect = state.effects[index];
        effect.life -= dt;
        if (!effect.kind) {
          effect.y -= 26 * dt;
        }
        if (effect.life <= 0) {
          state.effects.splice(index, 1);
        }
      }
    }

    function update(dt) {
      pollGamepad();
      handleGamepadActions();
      if (!state.running || state.screen !== "play") {
        if (state.running && state.screen === "hub") {
          state.elapsed += dt;
          updateHub(dt);
        }
        updateEffects(dt);
        updateHud();
        finishInputFrame();
        return;
      }
      state.elapsed += dt;
      updateSageWorldSpells(dt);
      const worldDt = dt * getWorldTimeScale();
      updatePlayer(worldDt);
      if (state.screen !== "play") {
        updateEffects(worldDt);
        updateHud();
        finishInputFrame();
        return;
      }
      updateProjectiles(worldDt);
      updateAnchors(worldDt);
      updateEnemies(worldDt);
      updatePickups(worldDt);
      updateHazards(worldDt);
      updateEffects(worldDt);
      updateHud();
      finishInputFrame();
    }

    function drawTiles() {
      const viewW = canvas.width / DPR;
      const viewH = canvas.height / DPR;
      const floorDef = getFloorDef();
      const palette = state.screen === "hub"
        ? { floorA: "#0a0c15", floorB: "#0d101d", wall: "#19162a", grid: "rgba(156, 128, 255, 0.055)", wallGrid: "rgba(247, 204, 120, 0.08)" }
        : THEME_PALETTES[floorDef.theme] || THEME_PALETTES.castle;
      const startCol = Math.floor(state.camera.x / TILE) - 1;
      const endCol = Math.ceil((state.camera.x + viewW) / TILE) + 1;
      const startRow = Math.floor(state.camera.y / TILE) - 1;
      const endRow = Math.ceil((state.camera.y + viewH) / TILE) + 1;

      ctx.fillStyle = palette.floorA;
      ctx.fillRect(0, 0, viewW, viewH);

      for (let row = startRow; row <= endRow; row += 1) {
        for (let col = startCol; col <= endCol; col += 1) {
          const x = col * TILE - state.camera.x;
          const y = row * TILE - state.camera.y;
          const wall = isWall(col, row);
          ctx.fillStyle = wall ? palette.wall : (col + row) % 2 ? palette.floorB : palette.floorA;
          ctx.fillRect(x, y, TILE, TILE);
          ctx.strokeStyle = wall ? palette.wallGrid : palette.grid;
          ctx.strokeRect(x, y, TILE, TILE);
        }
      }
    }

    function drawCircleEntity(entity, color, stroke = null) {
      const point = worldToScreen(entity.x, entity.y);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, entity.radius, 0, TAU);
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    function drawHealthBar(entity, width = 42) {
      const point = worldToScreen(entity.x, entity.y);
      const pct = clamp(entity.hp / entity.maxHp, 0, 1);
      ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
      ctx.fillRect(point.x - width * 0.5, point.y - entity.radius - 12, width, 5);
      ctx.fillStyle = pct > 0.35 ? "#63f0c4" : "#ff668a";
      ctx.fillRect(point.x - width * 0.5, point.y - entity.radius - 12, width * pct, 5);
    }

    function drawStatusPips(entity) {
      const active = Object.entries(entity.statuses || {}).filter(([, status]) => status.time > 0);
      if (!active.length) {
        return;
      }
      const point = worldToScreen(entity.x, entity.y);
      const startX = point.x - (active.length - 1) * 5;
      active.forEach(([key], index) => {
        ctx.fillStyle = STATUS_DEFS[key]?.color || "#f0ebff";
        ctx.beginPath();
        ctx.arc(startX + index * 10, point.y - entity.radius - 21, 3.2, 0, TAU);
        ctx.fill();
      });
    }

    function drawProjectile(projectile) {
      const point = worldToScreen(projectile.x, projectile.y);
      ctx.save();
      ctx.translate(point.x, point.y);
      if (projectile.kind === "arrow") {
        ctx.rotate(projectile.angle);
        ctx.strokeStyle = "#d9c48f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-13, 0);
        ctx.lineTo(12, 0);
        ctx.stroke();
        ctx.fillStyle = "#f0ebff";
        ctx.beginPath();
        ctx.moveTo(17, 0);
        ctx.lineTo(8, -5);
        ctx.lineTo(10, 0);
        ctx.lineTo(8, 5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#63f0c4";
        ctx.fillRect(-16, -5, 7, 3);
        ctx.fillRect(-16, 2, 7, 3);
      } else if (projectile.kind === "axe") {
        ctx.rotate(projectile.spin);
        ctx.strokeStyle = "#b88f5a";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(12, 0);
        ctx.stroke();
        ctx.fillStyle = "#d9d3c2";
        ctx.beginPath();
        ctx.arc(10, -4, 8, -0.9, 1.6);
        ctx.arc(10, 4, 8, -1.6, 0.9);
        ctx.closePath();
        ctx.fill();
      } else if (projectile.kind === "sageShard") {
        ctx.rotate(projectile.angle + projectile.spin * 0.35);
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(3, -9);
        ctx.lineTo(-15, -5);
        ctx.lineTo(-9, 0);
        ctx.lineTo(-15, 5);
        ctx.lineTo(3, 9);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (projectile.kind === "sageSpray") {
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(0, 0, projectile.radius + 2, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 0.42;
        ctx.beginPath();
        ctx.arc(-4, -3, projectile.radius * 0.75, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        const pulse = 0.72 + Math.sin((projectile.spin || 0) * 1.6) * 0.18;
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = "#ff8b4a";
        ctx.beginPath();
        ctx.arc(0, 0, 15 * pulse, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffd36c";
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#ff5d3d";
        ctx.beginPath();
        ctx.arc(-4, -2, 5, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawPlayerSprite(player, angle) {
      const point = worldToScreen(player.x, player.y);
      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.rotate(angle);
      if (player.invisible) {
        ctx.globalAlpha = 0.42;
      }
      if (state.classKey === "warrior") {
        ctx.fillStyle = player.dashTimer > 0 ? "#f7cc78" : "#4f6f92";
        ctx.beginPath();
        ctx.roundRect(-13, -14, 24, 28, 6);
        ctx.fill();
        ctx.fillStyle = "#d9d3c2";
        ctx.beginPath();
        ctx.arc(5, 0, 13, -1.2, 1.2);
        ctx.lineTo(1, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#b88f5a";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 12);
        ctx.lineTo(18, 18);
        ctx.stroke();
      } else if (state.classKey === "mage") {
        ctx.fillStyle = "#4b3474";
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-12, -13);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-12, 13);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = ELEMENT_COLORS.arcane;
        ctx.beginPath();
        ctx.arc(2, 0, 8, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#ff8b4a";
        ctx.beginPath();
        ctx.arc(17, 0, 4, 0, TAU);
        ctx.fill();
      } else if (state.classKey === "sage") {
        ctx.fillStyle = "#211b35";
        ctx.beginPath();
        ctx.moveTo(17, 0);
        ctx.lineTo(-9, -15);
        ctx.lineTo(-14, 0);
        ctx.lineTo(-9, 15);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#f7cc78";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = ELEMENT_COLORS.arcane;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = "#8dff9b";
        ctx.beginPath();
        ctx.arc(0, 0, 15, -0.65, 0.65);
        ctx.stroke();
      } else if (state.classKey === "pojo") {
        ctx.fillStyle = "#fff1d0";
        ctx.beginPath();
        ctx.ellipse(-2, 0, 17, 13, 0, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#ffe873";
        ctx.beginPath();
        ctx.arc(12, 0, 10, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#ff8b4a";
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(33, -5);
        ctx.lineTo(33, 5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ff5d3d";
        ctx.beginPath();
        ctx.moveTo(5, -8);
        ctx.lineTo(12, -20);
        ctx.lineTo(16, -8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#f0ebff";
        ctx.beginPath();
        ctx.ellipse(-6, -1, 10, 5, -0.18, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#1b1425";
        ctx.beginPath();
        ctx.arc(16, -3, 2, 0, TAU);
        ctx.fill();
      } else {
        ctx.fillStyle = "#315c4b";
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(-11, -12);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-11, 12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#d9c48f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(5, 0, 16, -0.9, 0.9);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawEnemySprite(enemy) {
      const point = worldToScreen(enemy.x, enemy.y);
      ctx.save();
      ctx.translate(point.x, point.y);
      const flash = enemy.hitTimer > 0;
      if (flash) {
        ctx.globalAlpha = 0.9;
      }
      if (enemy.type === "goblin") {
        ctx.fillStyle = flash ? "#f0ebff" : "#63f0c4";
        ctx.beginPath();
        ctx.arc(0, 2, enemy.radius, 0, TAU);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-9, -8);
        ctx.lineTo(-22, -13);
        ctx.lineTo(-11, 0);
        ctx.moveTo(9, -8);
        ctx.lineTo(22, -13);
        ctx.lineTo(11, 0);
        ctx.fill();
      } else if (enemy.type === "orc") {
        ctx.fillStyle = flash ? "#f0ebff" : "#5aa66d";
        ctx.beginPath();
        ctx.roundRect(-enemy.radius, -enemy.radius * 0.85, enemy.radius * 2, enemy.radius * 1.8, 8);
        ctx.fill();
        ctx.fillStyle = "#f0ebff";
        ctx.fillRect(-12, 10, 6, 8);
        ctx.fillRect(6, 10, 6, 8);
      } else if (enemy.type === "zombie") {
        ctx.fillStyle = flash ? "#f0ebff" : "#7b8f5a";
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#4d5e45";
        ctx.fillRect(-13, 3, 26, 9);
      } else if (enemy.type === "skeleton") {
        ctx.strokeStyle = flash ? "#f0ebff" : "#d9d3c2";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -7, 7, 0, TAU);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 15);
        ctx.moveTo(-12, 5);
        ctx.lineTo(12, 5);
        ctx.moveTo(-8, 24);
        ctx.lineTo(0, 15);
        ctx.lineTo(8, 24);
        ctx.stroke();
      } else if (enemy.type === "fireImp") {
        ctx.fillStyle = flash ? "#f0ebff" : "#ff8b4a";
        ctx.beginPath();
        ctx.moveTo(0, -enemy.radius - 8);
        ctx.lineTo(enemy.radius, enemy.radius);
        ctx.lineTo(0, enemy.radius * 0.55);
        ctx.lineTo(-enemy.radius, enemy.radius);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ffd36c";
        ctx.beginPath();
        ctx.arc(0, 2, 6, 0, TAU);
        ctx.fill();
      } else {
        ctx.fillStyle = flash ? "#f0ebff" : enemy.color || "#8e5cff";
        ctx.beginPath();
        if (enemy.type === "elemental") {
          ctx.moveTo(0, -enemy.radius - 8);
          ctx.lineTo(enemy.radius + 8, 0);
          ctx.lineTo(0, enemy.radius + 8);
          ctx.lineTo(-enemy.radius - 8, 0);
        } else if (enemy.isBoss) {
          ctx.arc(0, 0, enemy.radius, 0, TAU);
        } else {
          ctx.moveTo(0, -enemy.radius - 8);
          ctx.lineTo(enemy.radius, enemy.radius);
          ctx.lineTo(-enemy.radius, enemy.radius);
        }
        ctx.closePath();
        ctx.fill();
        if (enemy.isBoss) {
          ctx.strokeStyle = "#f7cc78";
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.fillStyle = "rgba(247, 204, 120, 0.22)";
          ctx.beginPath();
          ctx.arc(0, 0, enemy.radius * 1.22, 0, TAU);
          ctx.fill();
        } else {
          ctx.fillStyle = "#120d1f";
          ctx.beginPath();
          ctx.arc(0, -2, 7, 0, TAU);
          ctx.fill();
        }
      }
      if (enemy.faction === "ally" || enemy.inactiveElemental) {
        ctx.strokeStyle = enemy.inactiveElemental ? "#c2b8d8" : "#9df7a4";
        ctx.lineWidth = enemy.inactiveElemental ? 2 : 3;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius + 7, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function drawHazard(hazard) {
      const point = worldToScreen(hazard.x, hazard.y);
      const alpha = clamp(hazard.life / hazard.maxLife, 0, 1);
      ctx.save();
      if (hazard.kind === "meteorWarning") {
        ctx.globalAlpha = 0.36 + (1 - alpha) * 0.32;
        ctx.strokeStyle = hazard.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(point.x, point.y, hazard.radius * (0.82 + (1 - alpha) * 0.18), 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = hazard.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, hazard.radius, 0, TAU);
        ctx.fill();
        ctx.restore();
        return;
      }
      if (hazard.kind === "vortex") {
        const spin = performance.now() * 0.004;
        ctx.globalAlpha = 0.34;
        ctx.fillStyle = hazard.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, hazard.radius, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 0.78;
        ctx.strokeStyle = hazard.color;
        ctx.lineWidth = 4;
        for (let arm = 0; arm < 4; arm += 1) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, hazard.radius * (0.28 + arm * 0.17), spin + arm, spin + arm + Math.PI * 1.35);
          ctx.stroke();
        }
        ctx.restore();
        return;
      }
      ctx.globalAlpha = 0.28 + alpha * 0.2;
      ctx.fillStyle = hazard.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, hazard.radius, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = hazard.color;
      ctx.lineWidth = hazard.kind === "mine" ? 3 : 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, hazard.radius * (hazard.kind === "mine" ? 0.55 + Math.sin(hazard.life * 6) * 0.08 : 1), 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    function drawExitPortal() {
      const floorDef = getFloorDef();
      if (state.screen !== "play" || !state.floorClear || !floorDef.exitPortal) {
        return;
      }
      const point = worldToScreen(floorDef.exitPortal.x, floorDef.exitPortal.y);
      const pulse = Math.sin(performance.now() * 0.004) * 0.5 + 0.5;
      ctx.save();
      const glow = ctx.createRadialGradient(point.x, point.y, 4, point.x, point.y, floorDef.exitPortal.radius * 1.55);
      glow.addColorStop(0, "rgba(99, 240, 196, 0.36)");
      glow.addColorStop(0.48, "rgba(247, 204, 120, 0.18)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(point.x, point.y, floorDef.exitPortal.radius * 1.65, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = "#63f0c4";
      ctx.lineWidth = 4 + pulse * 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, floorDef.exitPortal.radius * (0.82 + pulse * 0.09), 0, TAU);
      ctx.stroke();

      ctx.fillStyle = "#f0ebff";
      ctx.font = "800 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Exit Portal", point.x, point.y - floorDef.exitPortal.radius - 8);
      ctx.restore();
    }

    function drawHubPortals() {
      const time = performance.now() * 0.001;
      ctx.save();
      ctx.textAlign = "center";
      for (const label of HUB_REALM_LABELS) {
        const point = worldToScreen(label.x, label.y);
        ctx.fillStyle = label.color;
        ctx.font = "800 12px Fira Code, monospace";
        ctx.fillText(label.text, point.x, point.y);
      }
      ctx.restore();

      for (const portal of HUB_LEVEL_PORTALS) {
        const point = worldToScreen(portal.x, portal.y);
        const pulse = Math.sin(time * 3 + portal.floorNumber * 0.37) * 0.5 + 0.5;
        const unlocked = isHubLevelPortalUnlocked(portal);
        const cleared = isHubLevelPortalCleared(portal);
        const playerNear = state.player && distanceSquared(state.player.x, state.player.y, portal.x, portal.y) < (portal.radius + 130) ** 2;
        const glow = ctx.createRadialGradient(point.x, point.y, 4, point.x, point.y, portal.radius * 2.1);
        glow.addColorStop(0, unlocked ? cleared ? "rgba(99, 240, 196, 0.28)" : "rgba(247, 204, 120, 0.24)" : "rgba(120, 118, 136, 0.16)");
        glow.addColorStop(0.55, unlocked ? `${portal.color}33` : "rgba(90, 88, 105, 0.16)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.save();
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, portal.radius * 2.05, 0, TAU);
        ctx.fill();

        ctx.globalAlpha = unlocked ? 1 : 0.48;
        ctx.fillStyle = "rgba(12, 10, 22, 0.82)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, portal.radius, 0, TAU);
        ctx.fill();

        ctx.strokeStyle = cleared ? "#63f0c4" : portal.color;
        ctx.lineWidth = unlocked ? 2.5 + pulse * 1.6 : 2;
        ctx.beginPath();
        ctx.arc(point.x, point.y, portal.radius * (0.78 + pulse * 0.08), 0, TAU);
        ctx.stroke();

        ctx.strokeStyle = unlocked ? cleared ? "rgba(99, 240, 196, 0.76)" : "rgba(247, 204, 120, 0.5)" : "rgba(194, 184, 216, 0.28)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(point.x, point.y, portal.radius + 5 + pulse * 5, 0, TAU);
        ctx.stroke();

        ctx.fillStyle = unlocked ? "#f0ebff" : "#8d879e";
        ctx.font = portal.bossStage ? "900 13px Inter, sans-serif" : "900 15px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(portal.bossStage ? "B" : String(portal.stage), point.x, point.y + 5);
        if (playerNear) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = unlocked ? "#f7cc78" : "#c2b8d8";
          ctx.font = "800 11px Inter, sans-serif";
          ctx.fillText(unlocked ? portal.name : "Locked", point.x, point.y + portal.radius + 18);
        }
        ctx.restore();
      }
    }

    function drawWorld() {
      drawTiles();

      if (state.screen === "hub") {
        drawHubPortals();
      }

      drawExitPortal();

      const marketZone = state.screen === "hub" ? HUB_MARKET : SHOP_ZONE;
      const shopPoint = worldToScreen(marketZone.x, marketZone.y);
      ctx.fillStyle = state.nearShop ? "rgba(247, 204, 120, 0.16)" : "rgba(247, 204, 120, 0.08)";
      ctx.beginPath();
      ctx.arc(shopPoint.x, shopPoint.y, marketZone.radius, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "rgba(247, 204, 120, 0.32)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#f7cc78";
      ctx.font = "800 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(state.screen === "hub" ? "Market" : "Rift Market", shopPoint.x, shopPoint.y - marketZone.radius - 10);

      for (const pickup of state.pickups) {
        drawCircleEntity(pickup, pickup.color, "rgba(255, 255, 255, 0.18)");
      }

      for (const hazard of state.hazards) {
        drawHazard(hazard);
      }

      for (const anchor of state.anchors) {
        const point = worldToScreen(anchor.x, anchor.y);
        ctx.fillStyle = "rgba(156, 128, 255, 0.2)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, anchor.radius + 12, 0, TAU);
        ctx.fill();
        drawCircleEntity(anchor, "#6c42d9", "#f7cc78");
        drawHealthBar(anchor, 58);
      }

      for (const projectile of state.projectiles) {
        drawProjectile(projectile);
      }

      for (const enemy of state.enemies) {
        drawEnemySprite(enemy);
        drawHealthBar(enemy, enemy.isBoss ? 92 : 42);
        drawStatusPips(enemy);
      }

      for (const effect of state.effects) {
        const point = worldToScreen(effect.x, effect.y);
        const alpha = clamp(effect.life / effect.maxLife, 0, 1);
        if (effect.kind === "cleave") {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = effect.color;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.arc(point.x, point.y, effect.range, effect.angle - effect.width * 0.5, effect.angle + effect.width * 0.5);
          ctx.closePath();
          ctx.fill();
        } else if (effect.kind === "cone") {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = effect.color;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.arc(point.x, point.y, effect.range, effect.angle - effect.width * 0.5, effect.angle + effect.width * 0.5);
          ctx.closePath();
          ctx.fill();
        } else if (effect.kind === "nova") {
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = effect.color;
          ctx.lineWidth = 18 * alpha;
          ctx.beginPath();
          ctx.arc(point.x, point.y, effect.range * (1.05 - alpha * 0.25), 0, TAU);
          ctx.stroke();
        } else if (effect.kind === "meteor") {
          ctx.globalAlpha = alpha * 0.68;
          ctx.fillStyle = effect.color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, effect.range * (1.05 - alpha * 0.28), 0, TAU);
          ctx.fill();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = "#ffd36c";
          ctx.lineWidth = 10 * alpha;
          ctx.beginPath();
          ctx.arc(point.x, point.y, effect.range * 0.58, 0, TAU);
          ctx.stroke();
        } else if (effect.kind === "beam") {
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = effect.color;
          ctx.lineWidth = effect.width || 8;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(point.x + Math.cos(effect.angle) * effect.range, point.y + Math.sin(effect.angle) * effect.range);
          ctx.stroke();
        } else if (effect.kind === "fissure") {
          const endX = point.x + Math.cos(effect.angle) * effect.range;
          const endY = point.y + Math.sin(effect.angle) * effect.range;
          ctx.globalAlpha = alpha * 0.72;
          ctx.strokeStyle = "rgba(20, 10, 8, 0.78)";
          ctx.lineWidth = effect.width || 86;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = effect.color;
          ctx.lineWidth = Math.max(10, (effect.width || 86) * 0.28);
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.lineCap = "butt";
        } else if (effect.kind === "lightningArc") {
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = effect.color;
          ctx.lineWidth = effect.width || 3;
          ctx.beginPath();
          for (const [index, arcPoint] of effect.points.entries()) {
            const screenPoint = worldToScreen(arcPoint.x, arcPoint.y);
            const jitter = Math.sin(performance.now() * 0.03 + index * 1.7) * 4;
            if (index === 0) {
              ctx.moveTo(screenPoint.x, screenPoint.y);
            } else {
              ctx.lineTo(screenPoint.x + jitter, screenPoint.y - jitter);
            }
          }
          ctx.stroke();
        } else {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = effect.color;
          ctx.font = "700 14px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(effect.text, point.x, point.y);
        }
      }
      ctx.globalAlpha = 1;

      const player = state.player;
      const angle = getAimAngle();
      drawPlayerSprite(player, angle);
      const playerPoint = worldToScreen(player.x, player.y);
      if (player.shell > 0 || Object.keys(player.wards).length) {
        ctx.globalAlpha = player.bodyShield > 0 ? 0.42 : player.shell > 0 ? 0.34 : 0.2;
        ctx.strokeStyle = player.bodyShield > 0 ? ELEMENT_COLORS.earth : player.shell > 0 ? ELEMENT_COLORS.earth : ELEMENT_COLORS.arcane;
        ctx.lineWidth = player.bodyShield > 0 ? 6 : player.shell > 0 ? 4 : 2;
        ctx.beginPath();
        ctx.arc(playerPoint.x, playerPoint.y, player.radius + 9 + Math.sin(performance.now() * 0.006) * 2, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      if (player.hasteTimer > 0) {
        ctx.globalAlpha = 0.28;
        ctx.strokeStyle = ELEMENT_COLORS.lightning;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(playerPoint.x, playerPoint.y, player.radius + 15 + Math.sin(performance.now() * 0.01) * 3, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      if (player.performanceTimer > 0) {
        ctx.globalAlpha = 0.32;
        ctx.strokeStyle = ELEMENT_COLORS.light;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(playerPoint.x, playerPoint.y, player.radius + 22 + Math.sin(performance.now() * 0.008) * 4, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      if (player.invisible) {
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = ELEMENT_COLORS.arcane;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(playerPoint.x, playerPoint.y, player.radius + 18, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    function updateHud() {
      const player = state.player;
      const classDef = getClassDef();
      const derived = getDerivedStats();
      const floorDef = getFloorDef();
      levelStatCard.hidden = isSage();
      coreStatCard.hidden = isSage();
      sheetCard.hidden = isSage();
      hpStat.textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
      levelStat.textContent = `${player.level} (${state.xp}/${state.xpToNext})`;
      goldStat.textContent = String(state.gold);
      floorStat.textContent = state.screen === "hub" ? "Realm Hub" : `${floorDef.realmName} ${floorDef.stage}/${floorDef.stageCount}`;
      coreStat.textContent = `${player.stats.strength} / ${player.stats.intelligence} / ${player.stats.agility}`;
      damageStat.textContent = String(derived.weaponDamage);
      spellStat.textContent = String(derived.spellDamage);
      speedStat.textContent = String(Math.round(derived.speed * (isSage() && player.hasteTimer > 0 ? 1.5 : 1) * (player.performanceTimer > 0 ? 1.77 : 1)));
      resistStat.textContent = `${Math.round(derived.defenseReduction * 100)}% + ${Math.round(classDef.guard * 100)}% ${classDef.guardElement}`;
      dropStat.textContent = `+${Math.round(derived.dropBonus * 100)}%`;
      statPointText.textContent = player.statPoints
        ? `Unspent stat points: ${player.statPoints}`
        : "Level up, quest, or buy training to earn stat points.";
      for (const button of statButtons) {
        button.disabled = isSage() || player.statPoints <= 0;
      }
      attackStat.textContent = classDef.attackName;
      skillStat.textContent = player.skillTimer <= 0 ? classDef.skillName : `${player.skillTimer.toFixed(1)}s`;
      dashStat.textContent = isSage()
        ? player.hasteTimer > 0 ? `Haste ${player.hasteTimer.toFixed(1)}s` : classDef.mobilityName
        : player.dashCooldown <= 0 ? classDef.mobilityName : `${player.dashCooldown.toFixed(1)}s`;
      nextFloorButton.textContent = state.floorClear ? "Return Hub" : "Realm Hub";
      nextFloorButton.disabled = state.screen !== "play" || !state.floorClear;
      if (state.screen === "select") {
        objectiveText.textContent = "Enter a hero name and choose a class to reach the realm hub.";
      } else if (state.screen === "hub") {
        objectiveText.textContent = "Walk the hub, use the market, then step into an unlocked numbered level portal.";
      } else {
        const bossAlive = hasLivingBoss();
        let objective = floorDef.objective;
        if (state.anchors.length && bossAlive) {
          objective = `Break ${state.anchors.length} rift anchor${state.anchors.length === 1 ? "" : "s"} and defeat the boss.`;
        } else if (state.anchors.length) {
          objective = `Break ${state.anchors.length} rift anchor${state.anchors.length === 1 ? "" : "s"}, then find the exit portal.`;
        } else if (bossAlive) {
          objective = "Defeat the boss to open the exit portal.";
        }
        objectiveText.textContent = state.floorClear
          ? `${floorDef.name} cleared. Walk into the exit portal to return to the realm hub.`
          : `${floorDef.name}: ${objective}`;
      }
      renderClassButtons();
      renderShop();
      renderQuests();
    }

    function loop(timestamp) {
      if (!lastTick) {
        lastTick = timestamp;
      }
      const dt = Math.min(0.033, (timestamp - lastTick) / 1000);
      lastTick = timestamp;
      update(dt);
      drawWorld();
      requestAnimationFrame(loop);
    }

    document.addEventListener("pointerdown", unlockAudio, { passive: true });

    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      aimSource = "mouse";
    });

    canvas.addEventListener("mousedown", (event) => {
      if (event.button === 0) {
        mouse.down = true;
        mouse.pressed = true;
        mouse.altDirect = event.shiftKey || event.altKey;
        if (mouse.altDirect) {
          event.preventDefault();
        }
      } else if (isSage() && event.button === 1) {
        castSageSpell("self");
        event.preventDefault();
      } else if (isSage() && event.button === 2) {
        castSageSpell("area");
        event.preventDefault();
      }
    });

    window.addEventListener("mouseup", () => {
      mouse.down = false;
      mouse.altDirect = false;
      stopSageChannel();
    });

    canvas.addEventListener("contextmenu", (event) => event.preventDefault());

    function isTypingTarget(target) {
      return target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
    }

    window.addEventListener("keydown", (event) => {
      unlockAudio();
      if (isTypingTarget(event.target)) {
        return;
      }
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (isSage() && SAGE_ELEMENT_KEYS[key]) {
        queueSageElement(SAGE_ELEMENT_KEYS[key]);
        event.preventDefault();
        return;
      }
      if (isSage() && key === "Alt") {
        event.preventDefault();
        return;
      }
      if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        keys.add(key);
        event.preventDefault();
      }
      if (!isSage() && key === "q" && state.screen === "play") {
        castCleave();
        event.preventDefault();
      }
      if (isSage() && key === "g" && state.screen === "play") {
        castSageSpell("self");
        event.preventDefault();
      }
      if (isSage() && key === "t" && state.screen === "play") {
        castSageSpell("rune");
        event.preventDefault();
      }
      if (key === " " || key === "Spacebar") {
        if (state.screen === "play") {
          dash();
        }
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      keys.delete(key);
    });

    window.addEventListener("resize", resizeCanvas);
    nextFloorButton.addEventListener("click", nextFloor);
    resetButton.addEventListener("click", () => resetGame(getCurrentRealmDef().floor));
    characterNameInput.addEventListener("input", syncSecretNameSelection);
    characterNameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        beginAdventure();
      }
    });
    startAdventureButton.addEventListener("click", beginAdventure);
    changeHeroButton.addEventListener("click", openCharacterSelect);
    characterRoster.addEventListener("click", (event) => {
      const button = event.target.closest("[data-select-class]");
      if (button) {
        setSelectedClass(button.dataset.selectClass);
      }
    });
    for (const button of classButtons) {
      button.addEventListener("click", () => setClass(button.dataset.class));
    }
    for (const button of sageElementButtons) {
      button.addEventListener("click", () => queueSageElement(button.dataset.sageElement));
    }
    for (const button of sageCastButtons) {
      button.addEventListener("click", () => castSageSpell(button.dataset.sageCast));
    }
    for (const button of statButtons) {
      button.addEventListener("click", () => assignStat(button.dataset.stat));
    }
    shopList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-shop]");
      if (button) {
        buyShopItem(button.dataset.shop);
      }
    });
    questList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-quest]");
      if (button) {
        claimQuest(button.dataset.quest);
      }
    });

    resizeCanvas();
    resetRunProgress();
    openCharacterSelect();
    requestAnimationFrame(loop);
