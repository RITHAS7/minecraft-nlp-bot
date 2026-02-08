AI-Powered Minecraft Bot with Live Dashboard

An intelligent Minecraft bot powered by OpenAI's GPT-4o-mini with Openrouter api that can understand natural language commands, perform complex tasks, and provide a real-time web dashboard for monitoring and control.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![Minecraft](https://img.shields.io/badge/minecraft-1.16%2B-success.svg)

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Bot Capabilities](#bot-capabilities)
- [Web Dashboard](#web-dashboard)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)


## ✨ Features

### 🎮 Intelligent Bot Capabilities
- **Natural Language Processing**: Understands conversational commands via GPT-4o-mini
- **Autonomous Task Execution**: Mines blocks, builds structures, fights mobs, and more
- **Smart Pathfinding**: Navigates terrain intelligently using mineflayer-pathfinder
- **Self-Defense**: Automatically defends itself when attacked by hostile mobs
- **Player Protection**: Rushes to help when players are hurt by hostile entities
- **Inventory Management**: Manages items, gives items to players, deposits in chests
- **Respawn Recovery**: Automatically returns to last known player location after death

### 🌐 Real-Time Web Dashboard
- **Live Bot Stats**: Health, hunger, position, inventory in real-time
- **First-Person POV Stream**: See what the bot sees via prismarine-viewer
- **Chat Interface**: Send commands through web interface or in-game chat
- **Terminal Output Streaming**: Live console logs streamed to browser
- **Connection Management**: Easy server connection configuration
- **Modern Glassmorphism UI**: Beautiful, responsive interface with Minecraft aesthetics

### 🛠️ Advanced Features
- **Function Calling**: AI decides which functions to execute based on context
- **Task State Management**: Tracks current task and prevents conflicting operations
- **Multi-Source Control**: Commands via in-game chat or web interface
- **Persistent Context**: Remembers last player interaction across sessions
- **WebSocket Communication**: Real-time bidirectional communication
- **Error Recovery**: Graceful handling of failures with user notification

## 🎬 Demo

### Bot in Action
The bot can:
- Mine specific blocks: *"mine 5 oak logs"*
- Build structures: *"build me a house"*
- Follow players: *"follow me"*
- Combat mobs: *"kill that zombie"*
- Inventory tasks: *"give me all cobblestone"*
- Report status: *"what's your health?"*

### Web Dashboard Features
- Real-time bot position tracking
- Live inventory updates
- First-person POV viewer on port 3001
- Chat log with player/bot/system messages
- Terminal output streaming with timestamps

## 🔧 Technologies

### Core Dependencies
- **[Node.js](https://nodejs.org/)** - Runtime environment
- **[mineflayer](https://github.com/PrismarineJS/mineflayer)** - Minecraft bot framework
- **[Express](https://expressjs.com/)** - Web server
- **[Socket.IO](https://socket.io/)** - Real-time bidirectional communication
- **[mineflayer-pathfinder](https://github.com/PrismarineJS/mineflayer-pathfinder)** - Advanced pathfinding
- **[prismarine-viewer](https://github.com/PrismarineJS/prismarine-viewer)** - First-person view streaming
- **[OpenRouter API](https://openrouter.ai/)** - AI model access
- **[minecraft-data](https://github.com/PrismarineJS/minecraft-data)** - Minecraft data provider
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variable management

### Front-End
- **Vanilla JavaScript** - No frameworks needed
- **Socket.IO Client** - Real-time updates
- **Modern CSS** - Glassmorphism design with animations
- **Google Fonts** - Inter & VT323 fonts

## 📦 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v16.0.0 or higher)
   ```bash
   node --version
   ```

2. **Minecraft Java Edition** server (1.20.1 is the latest supported)
   - Can be local or remote
   - Online mode can be `false` for testing

3. **OpenRouter API Key**
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Get your API key from dashboard

4. **Git** (for cloning)
   ```bash
   git --version
   ```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/minecraft-nlp-bot.git
cd minecraft-nlp-bot
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- mineflayer & plugins
- express & socket.io
- AI/ML dependencies
- Canvas for rendering (may require system libraries)

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_api_key_here

# Bot Configuration (optional, can modify in code)
BOT_USERNAME=Pengu
MINECRAFT_HOST=localhost
MINECRAFT_PORT=56272
```

### 4. (Optional) Install Canvas System Dependencies

If canvas installation fails, install system dependencies:

**Windows:**
- No additional steps usually needed

**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

## ⚙️ Configuration

### Bot Settings

Edit [minecraft_bot_integrated.js](minecraft_bot_integrated.js) to customize:

```javascript
const BOT_CONFIG = {
  host: 'localhost',      // Minecraft server address
  port: 56272,            // Server port
  username: 'Pengu',      // Bot username
};

const GAME_CONSTANTS = {
  SEARCH_RADIUS: 32,      // Block search radius
  FOLLOW_DISTANCE: 2,     // Distance to maintain when following
  ATTACK_RANGE: 4,        // Melee attack range
  ATTACK_INTERVAL: 500,   // Attack cooldown (ms)
  CHEST_SEARCH_RADIUS: 6, // Chest detection radius
  COMBAT_RANGE: 32,       // Max combat engagement range
};
```

### AI Model Selection

Change the AI model in [minecraft_bot_integrated.js](minecraft_bot_integrated.js):

```javascript
const OPENROUTER_MODEL = "openai/gpt-4o-mini"; // Fast & cheap
// const OPENROUTER_MODEL = "openai/gpt-4o";   // More capable
// const OPENROUTER_MODEL = "anthropic/claude-3-sonnet"; // Alternative
```

### Web Server Port

Default port is 3000. Change in code:

```javascript
const PORT = 3000; // Web dashboard port
// POV viewer runs on 3001
```

## 🎯 Usage

### Starting the Bot

```bash
npm start
```

Or with auto-restart on changes:
```bash
npm run dev
```

### Accessing the Dashboard

1. **Web Interface**: Open `http://localhost:3000` in your browser
2. **POV Viewer**: Open `http://localhost:3001` for first-person view

### Sending Commands

#### Via Web Dashboard:
1. Type command in chat input
2. Press Enter or click Send
3. Bot responds in chat and executes task

#### Via In-Game Chat:
1. Join the Minecraft server
2. Type directly in chat
3. Bot reads and responds

### Example Commands

```
Natural language works!

✅ "mine 10 cobblestone"
✅ "follow me"
✅ "give me all dirt"
✅ "build a house"
✅ "kill that zombie"
✅ "what's your health?"
✅ "deposit items in chest"
✅ "stop following"
✅ "stop everything"
```

## 🤖 Bot Capabilities

### Mining
- **Function**: `mine_block`
- **Usage**: Mine specific blocks with optional quantity
- **Example**: *"mine 5 oak logs"*
- **Features**: 
  - Searches within 32 block radius
  - Pathfinds to blocks automatically
  - Reports progress and completion

### Item Management
- **Function**: `give_items`
- **Usage**: Transfer items from bot to player
- **Example**: *"give me 20 cobblestone"*
- **Features**:
  - Can give specific quantities or all
  - Tosses items near player
  - Updates inventory in real-time

### Following
- **Function**: `follow_player`
- **Usage**: Bot follows player movements
- **Example**: *"follow me"*
- **Features**:
  - Maintains 2 block distance
  - Navigates around obstacles
  - Can follow while doing other tasks

### Building
- **Function**: `build_house`
- **Usage**: Constructs a house automatically
- **Example**: *"build me a house"*
- **Features**:
  - 5x5x4 structure
  - Oak log corners, cobblestone walls
  - Oak plank floor, door entrance
  - Smart scaffolding with cleanup

### Combat
- **Function**: `kill_mobs`
- **Usage**: Attack hostile or specific mobs
- **Example**: *"kill that zombie"* or *"attack creepers"*
- **Features**:
  - Prioritizes hostile mobs
  - Uses best weapon in inventory
  - Pathfinds to targets
  - Auto-engages when attacked
  - Protects players from threats

### Status Reporting
- **Function**: `report_status`
- **Usage**: Get bot's current state
- **Example**: *"what's your status?"*
- **Reports**:
  - Health (❤️) and hunger (🍗)
  - Current position (📍)
  - Inventory contents (🎒)
  - Active task

### Storage
- **Function**: `stash_items`
- **Usage**: Deposit items in nearby chest
- **Example**: *"put items in chest"*
- **Features**:
  - Finds chest within 6 blocks
  - Opens and deposits items
  - Reports what was stored

### Control
- **Functions**: `stop_follow`, `stop_all`
- **Usage**: Halt current activities
- **Examples**: *"stop following"*, *"stop everything"*

## 🖥️ Web Dashboard

### Main Interface Components

#### 1. Header
- **Title**: PenguPOV - Live Stream
- **Connection Status**: Shows bot online/offline state

#### 2. Bot Stats Panel
Real-time metrics updated every 2 seconds:
- **Health**: ❤️ HP bar with percentage
- **Hunger**: 🍗 Food level
- **Position**: 📍 X, Y, Z coordinates
- **Task**: Current activity (mining, fighting, following, etc.)
- **Inventory**: Live item counts with icons

#### 3. Chat Interface
- **Message Log**: Scrolling chat with color-coded messages
  - 🟢 Player messages
  - 🔵 Bot responses
  - 🟡 System notifications
- **Input Field**: Send commands to bot
- **Auto-scroll**: Keeps latest messages visible

#### 4. Terminal Output
- **Live Logs**: Real-time console output
- **Timestamps**: Each log entry timestamped
- **Color Coding**:
  - White: Normal logs
  - Red: Errors
  - Green: Success messages

#### 5. POV Viewer (Port 3001)
- **First-Person View**: See exactly what bot sees
- **Real-time**: Updates as bot moves

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Web Browser                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Dashboard  │  │   Chat UI    │  │ POV View │ │
│  │  (Port 3000) │  │              │  │(Port 3001│ │
│  └───────┬──────┘  └───────┬──────┘  └────┬─────┘ │
│          │                 │                │       │
│          └─────────────────┴────────────────┘       │
│                      │                               │
│              Socket.IO (WebSocket)                   │
└──────────────────────┼──────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────┐
│              Express Server (Node.js)               │
│  ┌──────────────────┴────────────────────────────┐ │
│  │         minecraft_bot_integrated.js           │ │
│  │  ┌────────────┐  ┌─────────────┐ ┌─────────┐ │ │
│  │  │  Web Server│  │  Socket.IO  │ │Prismarine│ │
│  │  │  (Express) │  │   Handler   │ │  Viewer  │ │
│  │  └──────┬─────┘  └──────┬──────┘ └────┬────┘ │ │
│  │         │                │              │      │ │
│  │         └────────────────┴──────────────┘      │ │
│  │                          │                      │ │
│  │         ┌────────────────┴────────────────┐    │ │
│  │         │      Mineflayer Bot Core        │    │ │
│  │         │  ┌──────────────────────────┐   │    │ │
│  │         │  │   AI Decision Engine     │   │    │ │
│  │         │  │  (OpenRouter GPT-4o-mini)│   │    │ │
│  │         │  └────────┬─────────────────┘   │    │ │
│  │         │           │                      │    │ │
│  │         │  ┌────────┴─────────────────┐   │    │ │
│  │         │  │   Function Executor      │   │    │ │
│  │         │  │ • mine_block()           │   │    │ │
│  │         │  │ • give_items()           │   │    │ │
│  │         │  │ • follow_player()        │   │    │ │
│  │         │  │ • build_house()          │   │    │ │
│  │         │  │ • kill_mobs()            │   │    │ │
│  │         │  │ • report_status()        │   │    │ │
│  │         │  │ • stash_items()          │   │    │ │
│  │         │  └──────────────────────────┘   │    │ │
│  │         │                                  │    │ │
│  │         │  ┌──────────────────────────┐   │    │ │
│  │         │  │   Pathfinder Plugin      │   │    │ │
│  │         │  └──────────────────────────┘   │    │ │
│  │         └──────────────┬───────────────────┘    │ │
│  └────────────────────────┼────────────────────────┘ │
└────────────────────────────┼──────────────────────────┘
                             │
                    Minecraft Protocol
                             │
┌────────────────────────────┼──────────────────────────┐
│                  Minecraft Server                     │
│                    (localhost:56272)                  │
└───────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input**: Command entered via web or in-game chat
2. **AI Processing**: OpenRouter GPT-4o-mini analyzes intent and context
3. **Function Selection**: AI chooses appropriate function with parameters
4. **Execution**: Bot executes task using mineflayer APIs
5. **Feedback**: Results broadcast via Socket.IO to all connected clients
6. **State Update**: Dashboard updates stats, chat, and terminal output

### Key Components

#### AI Decision Engine
```javascript
async function askAI(message, username, context)
```
- Sends message + context to OpenRouter API
- Receives function calls or text responses
- Handles tool selection automatically

#### Task Execution Layer
- Independent async functions for each capability
- State management prevents conflicts
- Error handling with user feedback

#### Real-Time Communication
- Socket.IO events:
  - `terminal-output`: Console logs
  - `bot-stats`: Health, position, inventory
  - `chat-message`: Chat messages
  - `bot-status`: Connection events
  - `pov-ready`: Viewer initialization

## 📡 API Reference

### Socket.IO Events

#### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `player-message` | `string` | Command from web interface |

#### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `bot-stats` | `{health, food, position, inventory, task}` | Bot metrics |
| `chat-message` | `{username, message, type}` | Chat message |
| `terminal-output` | `{type, message, timestamp}` | Console log |
| `bot-status` | `{status, message}` | Connection status |
| `pov-ready` | `{port}` | POV viewer port |

### OpenRouter API Integration

#### Request Format
```javascript
{
  model: "openai/gpt-4o-mini",
  messages: [
    { role: "system", content: "System prompt" },
    { role: "user", content: "User message" }
  ],
  tools: [...], // Function definitions
  tool_choice: "auto"
}
```

#### Response Format
```javascript
{
  choices: [{
    message: {
      content: "Text response", // OR
      tool_calls: [{
        function: {
          name: "function_name",
          arguments: "{...}"
        }
      }]
    }
  }]
}
```

## 📁 Project Structure

```
minecraft-nlp-bot/
├── minecraft_bot_integrated.js   # Main bot logic
├── package.json                  # Dependencies & scripts
├── .env                         # Environment variables (create this)
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
│
├── public/                      # Web dashboard files
│   ├── index.html              # Main dashboard page
│   ├── styles.css              # Styling (if separated)
│   ├── README.md               # Frontend docs
│   │
│   ├── block/                  # Minecraft block textures metadata
│   │   ├── *.png.mcmeta       # Animation data for blocks
│   │   └── ...
│   │
│   └── item/                   # Minecraft item textures metadata
│       ├── *.png.mcmeta       # Animation data for items
│       └── ...
│
└── node_modules/               # NPM packages (auto-generated)
```

### Key Files

- **minecraft_bot_integrated.js**: 
  - Bot initialization
  - AI integration
  - Task execution functions
  - Express server setup
  - Socket.IO handlers
  - Event listeners

- **public/index.html**:
  - Dashboard UI
  - Socket.IO client
  - Real-time updates
  - Chat interface
  - Terminal output display

- **package.json**:
  - Project metadata
  - Dependencies
  - Scripts (start, dev)

- **.env**:
  - OPENROUTER_API_KEY
  - Optional bot configuration

## 🐛 Troubleshooting

### Bot Won't Connect to Server

**Problem**: `Error: connect ECONNREFUSED`

**Solutions**:
1. Verify Minecraft server is running
2. Check `BOT_CONFIG.host` and `BOT_CONFIG.port`
3. Ensure server allows cracked accounts (if `online-mode=false`)
4. Try connecting manually with Minecraft client first

### Canvas Installation Fails

**Problem**: `Error: Cannot find module 'canvas'`

**Solutions**:
1. Install system dependencies (see [Installation](#installation))
2. On Windows, ensure Visual Studio Build Tools installed
3. Try `npm install canvas --build-from-source`
4. Use Node.js v16-v18 (v20+ may have issues)

### OpenRouter API Errors

**Problem**: `API Error: Invalid API key`

**Solutions**:
1. Verify `.env` file exists in root directory
2. Check API key is correct (no extra spaces)
3. Ensure you have credits on OpenRouter account
4. Check API key permissions

### Bot Gets Stuck

**Problem**: Bot stops responding or stands still

**Solutions**:
1. Use `stopAllTasks()` - say *"stop everything"*
2. Check terminal for errors
3. Bot may be waiting for task completion
4. Restart bot if unresponsive

### POV Viewer Won't Load

**Problem**: Port 3001 shows error or blank page

**Solutions**:
1. Wait 5-10 seconds after bot spawns
2. Check terminal for "POV Viewer started" message
3. Ensure port 3001 not in use by another app
4. Try `http://localhost:3001` not `127.0.0.1:3001`

### High CPU/Memory Usage

**Problem**: Node process using excessive resources

**Solutions**:
1. Reduce `SEARCH_RADIUS` and `COMBAT_RANGE`
2. Increase `ATTACK_INTERVAL` to reduce attack frequency
3. Close POV viewer when not needed
4. Use lighter AI model (gpt-4o-mini recommended)
