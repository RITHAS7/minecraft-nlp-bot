# 🤖 Minecraft Bot with Natural Language Understanding

**Talk to your Minecraft bot like a real player.**

This isn't another command-based bot. Using GPT-4o-mini through OpenRouter, this bot understands natural language and has a personality. Say "dawg build me a crib?" and it will. Tell it "there's a zombie behind you!" and it fights back. Ask "how are you doing?" and it responds like a person would.

Built with mineflayer, acts as your companion, it can mine, build structures, fight mobs, follow players, and manage inventory - all while you watch through a live web dashboard with first-person POV streaming.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![Minecraft](https://img.shields.io/badge/minecraft-1.16%2B-success.svg)

---

**Key difference from other bots**: The AI interprets your intent from natural speech and responds with personality. No memorizing commands or special syntax.

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


## ✨ Features

### 💬 Natural Language & Personality
The bot doesn't just execute commands - it has personality and responds like a player would:

**Examples of its personality:**
- When attacked: *"Hey! Not cool!"* or *"Ouch! You're going down!"*
- When protecting you: *"I got your back!"* or *"Don't worry, I'll handle this!"*
- After respawning: *"I died! Respawning..."* then *"On my way back!"*
- General responses: *"Sure thing!"*, *"On it!"*, *"All clear!"*

**Understands context:** The AI knows its current task, health, and inventory when making decisions. Ask "are you okay?" when it's low on health and it responds appropriately.

**No rigid syntax:** You don't type commands like `/bot mine 10 cobblestone`. Just say it like you'd say it to another person: "can you get me some cobblestone?" or "I need cobblestone" or "mine cobblestone please".

### 🏗️ Building Capabilities
This is one of the coolest features - the bot can construct complete structures autonomously.

**House Building:**
- Just say "build me a house" in natural language
- Bot finds a suitable flat spot near itself (or near you)
- Constructs a proper 5x5 house with:
  - Oak log corner posts for structure
  - Cobblestone walls
  - Oak plank flooring
  - Door opening for entry
  - Cobblestone roof
- Smart about not trapping itself - moves to safe position before building
- Clears grass and obstacles first
- Cleans up temporary scaffolding blocks after

**What you need**: The bot must have oak_planks, oak_logs, and cobblestone in its inventory. You can tell it to mine these first, or give them to it.

### 🤖 Other Capabilities
- **Mining**: Finds and mines specific blocks within 32-block radius, with quantity control
- **Combat**: Auto-defends when attacked, can hunt specific mob types, protects nearby players
- **Following**: Follows players while navigating obstacles, maintains 2-block distance
- **Item Management**: Gives items to players, deposits items in nearby chests
- **Status Reporting**: Reports health, hunger, position, and inventory on request
- **Auto-Recovery**: After dying, automatically finds its way back to the last player it interacted with

### 🌐 Web Dashboard
A browser-based interface to monitor and control the bot:

- **Stats Panel**: Health, hunger, coordinates, and full inventory (updates every 2 seconds)
- **First-Person POV**: Live stream of what the bot sees (port 3001, powered by prismarine-viewer)
- **Chat Interface**: Send commands through your browser instead of in-game
- **Live Terminal**: See all console output in real-time with timestamps
- **Clean UI**: Glassmorphism design with Minecraft-themed colors

Works in any modern browser. Command the bot without even launching Minecraft.

### ⚙️ How It Works Technically
- **GPT-4o-mini via OpenRouter**: AI reads your message + bot context (current task, health, inventory), then decides to either respond with text or call a function
- **Function Calling**: When AI decides to take action, it calls functions like `mine_block()`, `build_house()`, etc. with parameters
- **Task Manager**: Prevents conflicts (won't start building while mining, etc.)
- **Dual Control**: Send commands from in-game chat or web dashboard
- **Socket.IO**: Real-time communication between bot, server, and browser
- **mineflayer-pathfinder**: Smart navigation and terrain handling

## 🎬 What You Can Say

The bot understands natural language. Here are real examples:

**Building:**
- *"build ma crib here"*
- *"Build a house over there"*

**Mining:**
- *"Mine 10 cobblestones"*
- *"Get me some oak logs"*
- *"I need 5 dirt blocks"*

**Social/Status:**
- *"How are you?"* 
- *"What's your health?"*
- *"Show me your inventory"*

**Following & Control:**
- *"Follow me here"*
- *"Stop following bot"*
- *"Stop everything you're doing"*

**Combat:**
- *"Slime that zombie"*
- *"Attack the creeper"*

**Items:**
- *"Give me all your cobblestone"*
- *"Can I have 20 dirt?"*
- *"Put your items in a chest"*

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

2. **Minecraft Java Edition** server (1.16+ supported, tested up to 1.20.1)
   - Local or remote server
   - Set `online-mode=false` in server.properties for offline/bot accounts

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

### Talking to the Bot

The bot understands natural, conversational language. You don't need exact commands - just talk normally:

**Works:**
- "mine 10 cobblestone" ✅
- "can you get me some cobblestone?" ✅  
- "need cobblestones" ✅

**Building Examples:**
- "build me a crib" ✅
- "can you build a house?" ✅
- "house please" ✅

The AI figures out your intent from context. It also responds with personality - not just "OK" but things like "Sure thing!" or "On it!" or even "Hey! Not cool!" when attacked.

## 🤖 Bot Capabilities

### Mining
- **Function**: `mine_block`
- **Usage**: Finds and mines blocks within a 32-block radius
- **Example**: *"mine 5 oak logs"*, *"get me 10 cobblestone"*
- **How It Works**: 
  - Searches for the block type you specified
  - Pathfinds to each block
  - Digs them one by one
  - Reports progress ("Mined 3/10")
  - Stops if it can't find enough blocks

### Item Management  
- **Function**: `give_items`
- **Usage**: Gives items from bot's inventory to player
- **Example**: *"give me 20 cobblestone"*, *"give me all dirt"*
- **How It Works**:
  - Searches bot's inventory for matching items
  - Tosses items on the ground near player
  - Can give specific amount or everything it has
  - Updates dashboard inventory in real-time

### Following
- **Function**: `follow_player`  
- **Usage**: Bot follows player around
- **Example**: *"follow me"*
- **How It Works**:
  - Maintains 2-block distance from player
  - Uses pathfinding to navigate around obstacles
  - Can dig through blocks if needed
  - Updates path as player moves

### Building
- **Function**: `build_house`  
- **Usage**: Constructs a complete house structure from scratch
- **Example**: *"build me a house"*, *"can you build a house?"*
- **What It Builds**:
  - 5x5 blocks wide/deep, 4 blocks tall
  - Oak log corner posts
  - Cobblestone walls  
  - Oak plank flooring
  - Door opening on one side
  - Cobblestone roof
- **How It Works**:
  - Finds a suitable flat area near the bot
  - Moves to a safe position outside the build area (won't trap itself)
  - Clears any grass/flowers/obstacles
  - Places floor first, then walls, then roof
  - Cleans up any temporary scaffolding blocks
  - Uses materials from its inventory (needs oak_planks, oak_log, cobblestone)
- **Note**: Make sure the bot has building materials or can mine them first

### Combat
- **Function**: `kill_mobs`
- **Usage**: Attacks hostile mobs or specific mob types
- **Example**: *"kill that zombie"*, *"attack creepers"*
- **Behavior**:
  - **Auto-Defense**: Automatically fights back when hit
  - **Player Protection**: Attacks mobs that hurt nearby players  
  - Searches within 32-block range
  - Equips best weapon (sword/axe) from inventory
  - Pathfinds to target and attacks every 500ms
  - Stops when no more targets found
  - Will shout things like "Hey! Not cool!" or "Nobody hits me!" when attacked

### Status Reporting
- **Function**: `report_status`
- **Usage**: Reports bot's current state
- **Example**: *"what's your status?"*, *"how are you?"*
- **Reports**:
  - Health: ❤️ X/20 HP
  - Hunger: 🍗 X/20 Food  
  - Position: 📍 X, Y, Z coordinates
  - Inventory: 🎒 Item list with counts
  - Sent both in-game chat and to web dashboard

### Storage
- **Function**: `stash_items`  
- **Usage**: Deposits items into a nearby chest
- **Example**: *"put items in chest"*, *"deposit stuff"*
- **How It Works**:
  - Searches for a chest within 6 blocks
  - Opens the chest  
  - Deposits items from inventory
  - Reports what was stored

### Control
- **Functions**: `stop_follow`, `stop_all`
- **Usage**: Stop current activity
- **Examples**: *"stop following"*, *"stop everything"*
- Cancels pathfinding, combat, and other active tasks

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
- **First-Person View**: See exactly what the bot sees in real-time
- Opens automatically when bot spawns
- Uses prismarine-viewer for live rendering
- Updates as bot moves and looks around

## 🏗️ How It Works
### What Happens When You Send a Command

1. **User Input**: You type something in-game or in the web dashboard
2. **AI Processing**: Message + context (bot's current task, health, inventory count) sent to GPT-4o-mini
3. **Function Selection**: AI decides to either:
   - Respond with text ("I don't have any cobblestone right now")
   - Call a function with parameters (`mine_block`, `cobblestone`, `quantity: 10`)
4. **Execution**: Bot executes the function using mineflayer APIs
5. **Feedback**: Results sent to both in-game chat and web dashboard via Socket.IO
6. **State Update**: Dashboard updates inventory, health, position, task status


