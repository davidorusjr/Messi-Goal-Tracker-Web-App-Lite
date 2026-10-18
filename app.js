const STARTING_DATA = {
  updated: "2026-10-18",
  teams: [
    { id: "barcelona", name: "Barcelona", goals: 672 },
    { id: "argentina", name: "Argentina", goals: 126 },
    { id: "interMiami", name: "Inter Miami", goals: 104 },
    { id: "psg", name: "Paris Saint-Germain", goals: 32 },
  ],
};

const FIRST_TARGET = 1000;
const DAY_MS = 86_400_000;
const STARTING_INTER_MIAMI_GOALS = STARTING_DATA.teams.find((team) => team.id === "interMiami").goals;
const BIRTH_DATE = new Date("1987-06-24T12:00:00Z");
const STORAGE_KEY = "messi-manual-totals";
const $ = (id) => document.getElementById(id);
const formatNumber = (value) => value.toLocaleString("en-US");

let scenario = "club";
let manualData = loadManualData();

function validGoals(value) {
  return Number.isSafeInteger(value) && value >= 0 && value <= 2000;
}

function loadManualData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return { updated: STARTING_DATA.updated, interMiamiGoals: STARTING_INTER_MIAMI_GOALS };
    const oldInterMiami = Array.isArray(saved.teams)
      ? saved.teams.find((team) => team.id === "interMiami")?.goals
      : undefined;
    const interMiamiGoals = saved.interMiamiGoals ?? oldInterMiami;
    if (!validGoals(interMiamiGoals)) return { updated: STARTING_DATA.updated, interMiamiGoals: STARTING_INTER_MIAMI_GOALS };
    const dateIsValid = typeof saved.updated === "string" && !Number.isNaN(Date.parse(saved.updated));
    return { updated: dateIsValid ? saved.updated : STARTING_DATA.updated, interMiamiGoals };
  } catch {
    return { updated: STARTING_DATA.updated, interMiamiGoals: STARTING_INTER_MIAMI_GOALS };
  }
}

function saveManualData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(manualData));
    return true;
  } catch {
    return false;
  }
}

function totalGoals() {
  return teamBreakdown().reduce((sum, team) => sum + team.goals, 0);
}

function teamBreakdown() {
  return STARTING_DATA.teams.map((team) => ({
    ...team,
    goals: team.id === "interMiami" ? manualData.interMiamiGoals : team.goals,
  }));
}

function targetFor(total) {
  return Math.max(FIRST_TARGET, Math.floor(total / 50) * 50 + 50);
}

function paceOptions() {
  return {
    club: { label: "Club pace", sub: "40 / yr", rate: 40 },
    lower: { label: "Lower pace", sub: "30 / yr", rate: 30 },
  };
}

function renderDate() {
  const date = new Date(`${manualData.updated}T12:00:00`);
  $("asof").textContent = `As of ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
}

function renderBreakdown() {
  const section = $("breakdown");
  section.replaceChildren();
  const title = document.createElement("h2");
  title.id = "breakdown-title";
  title.className = "label";
  title.textContent = "Where they came from";
  section.append(title);

  const teams = teamBreakdown();
  const max = Math.max(1, ...teams.map((team) => team.goals));
  for (const team of teams) {
    const row = document.createElement("div");
    row.className = `row${team.id === "interMiami" ? " live" : ""}`;
    const name = document.createElement("b");
    name.textContent = team.name;
    const goals = document.createElement("em");
    goals.textContent = formatNumber(team.goals);
    const track = document.createElement("div");
    track.className = "track";
    const fill = document.createElement("span");
    fill.style.width = `${(team.goals / max) * 100}%`;
    track.append(fill);
    row.append(name, goals, track);
    section.append(row);
  }
}

function renderScenarios(options) {
  const section = $("seg");
  section.replaceChildren();
  for (const [key, option] of Object.entries(options)) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.scenario = key;
    button.setAttribute("aria-pressed", String(key === scenario));
    button.append(document.createTextNode(option.label));
    const small = document.createElement("small");
    small.textContent = option.sub;
    button.append(small);
    section.append(button);
  }
}

function renderEstimate(total, target, options) {
  const option = options[scenario];
  if (!option.rate || option.rate <= 0) {
    $("eta").textContent = "Unavailable";
    $("etasub").textContent = "Select an illustrative club-scoring scenario.";
    return;
  }
  const remaining = Math.max(0, target - total);
  const eta = new Date(Date.now() + (remaining / option.rate) * 365 * DAY_MS);
  const age = ((eta.getTime() - BIRTH_DATE.getTime()) / (365.25 * DAY_MS)).toFixed(1);
  $("eta").textContent = eta.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  $("etasub").textContent = `At ${option.rate} club goals a year · Messi would be ${age}`;
}

function render() {
  const total = totalGoals();
  const target = targetFor(total);
  const remaining = target - total;
  const options = paceOptions();

  $("total").textContent = formatNumber(total);
  const message = document.createDocumentFragment();
  const amount = document.createElement("span");
  amount.textContent = formatNumber(remaining);
  message.append(amount, document.createTextNode(` goals to ${formatNumber(target)}`));
  $("togo").replaceChildren(message);

  $("fill").style.width = `${Math.min(100, (total / target) * 100)}%`;
  $("progress").setAttribute("aria-valuemax", String(target));
  $("progress").setAttribute("aria-valuenow", String(total));
  $("halfway").textContent = formatNumber(target / 2);
  $("milestone").textContent = formatNumber(target);

  renderDate();
  renderBreakdown();
  renderScenarios(options);
  renderEstimate(total, target, options);

  $("inter-miami").value = String(manualData.interMiamiGoals);
}

$("manual-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const interMiamiGoals = Number($("inter-miami").value);
  if (!validGoals(interMiamiGoals)) {
    $("save-status").textContent = "Enter a whole number from 0 to 2,000.";
    return;
  }

  manualData = { updated: new Date().toISOString().slice(0, 10), interMiamiGoals };
  const saved = saveManualData();
  render();
  $("save-status").textContent = saved
    ? "Manual totals saved in this browser."
    : "Totals changed for this session, but browser storage is unavailable; they may not persist after closing the page.";
});

$("reset").addEventListener("click", () => {
  manualData = { updated: STARTING_DATA.updated, interMiamiGoals: STARTING_INTER_MIAMI_GOALS };
  const saved = saveManualData();
  render();
  $("save-status").textContent = saved
    ? "Starting figures restored in this browser."
    : "Starting figures restored for this session; browser storage is unavailable.";
});

$("seg").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-scenario]");
  if (!button) return;
  scenario = button.dataset.scenario;
  render();
});

render();
