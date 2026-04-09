# XenoGotchi

**Raise your Xenomorph** — a web-based virtual pet (Tamagotchi) where you nurture a Xenomorph through its entire lifecycle, from Ovomorph to Queen.

> *"In space, no one can hear it purr."*

## What is this?

XenoGotchi is an open-source browser game inspired by classic virtual pets (Tamagotchi), themed around the Alien franchise's Xenomorph lifecycle. You manage five stats, make decisions during random events, and guide your creature's evolution through branching paths — all while sending real-time metrics to **Grafana Cloud**.

## Lifecycle & Evolution Tree

```
Ovomorph (Egg)
  └─▶ Facehugger ─── [select host] ──▶ Chestburster
                                          ├─▶ Warrior    (high aggression)  ─▶ Praetorian ─▶ Queen ♛
                                          ├─▶ Drone      (high hive bond)   ─▶ Praetorian ─▶ Queen ♛
                                          ├─▶ Lurker     (high stealth)
                                          ├─▶ Runner     (animal host)
                                          ├─▶ Neomorph   (neglect → game over)
                                          └─▶ Predalien  (Yautja DNA item)
```

**11 stages** with unique ASCII art, stat decay rates, and available actions.

Host choice matters: picking a human, dog, or engineer host changes the evolution tree.

## Stats

| Stat | Represents | Icon |
|------|-----------|------|
| Biomass | Hunger / organic fuel | 🍖 |
| Aggression | Combat energy | 🔥 |
| Hive Bond | Loyalty to the hive | 🏠 |
| Acid Potency | Health / defense | 🧪 |
| Stealth | Concealment ability | 👁️ |

All stats decay over time at stage-specific rates. The Chestburster stage decays fastest. If any stat hits 0, the specimen dies.

## Actions

Feed, Hunt, Build Hive, Stalk, Molt (triggers evolution check), Rest, and Lay Eggs (Queen only → New Game+).

Each action has a cooldown and stat effects.

## Random Events

Seven events with branching choices and stat checks:

- **Colonial Marines Raid** — fight or hide
- **Power Failure** — hunt in darkness or fortify the hive
- **Host Opportunity** — capture for hive or feed immediately
- **Rival Xenomorph** — assert dominance or retreat
- **Weyland-Yutani Capture Team** — destroy equipment or play dead
- **Royal Jelly Discovery** — consume (Queen trigger) or save
- **Yautja Hunt** — ultra-rare, grants Predalien DNA on success

## Grafana Metrics

XenoGotchi sends real-time game telemetry to Grafana Cloud using the **Influx line protocol**:

| Measurement | Tags | Fields |
|------------|------|--------|
| `xenogotchi_stats` | stage, generation | biomass, aggression, hive_bond, acid_potency, stealth, alive_seconds |
| `xenogotchi_action` | stage, action | count |
| `xenogotchi_evolution` | from, to | count |
| `xenogotchi_event` | stage, event, outcome | count |
| `xenogotchi_gameover` | stage, reason, generation | alive_seconds, evolutions, actions |

### Setup

1. Copy `.env.example` to `.env`
2. Fill in your Grafana Cloud credentials:
   ```
   VITE_GC_USER=your_grafana_cloud_user_id
   VITE_GC_PASS=your_grafana_cloud_influx_write_token
   VITE_GC_URL=influx-prod-XX-prod-eu-central-0.grafana.net
   VITE_METRICS_ENABLED=true
   ```
3. Metrics are sent via Vite's dev proxy to avoid CORS issues.

## Quick Start

```bash
git clone <repo-url>
cd xenogotchi
npm install
cp .env.example .env  # edit with your Grafana Cloud creds
npm run dev
```

Open `http://localhost:5173` and start raising your Xenomorph.

## Tech Stack

- **React 18** + **TypeScript** (Vite)
- **Zustand** for state management with LocalStorage persistence
- **Influx line protocol** for Grafana Cloud metrics
- **CSS** pixel-art aesthetic with CRT scanline filter
- **ASCII art** sprites for each lifecycle stage

## Project Structure

```
src/
├── types/          # TypeScript interfaces
├── data/           # Stage, event, action, achievement definitions
├── engine/         # Game logic (lifecycle, stat decay, events, actions)
├── stores/         # Zustand stores (pet state, settings)
├── utils/          # Metrics client, time formatters
├── components/
│   ├── Pet/        # ASCII sprite renderer
│   ├── Stats/      # Stat bars
│   ├── Actions/    # Action buttons with cooldowns
│   ├── Events/     # Event modal with choices
│   ├── HUD/        # Stage indicator, game log
│   ├── Environment/ # Themed backgrounds
│   └── Menu/       # Main menu, game over, settings
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Full stylesheet
```

## License

MIT
