/**
 * AI-Powered Minecraft Bot - FULLY INTEGRATED
 * Complete terminal output streaming + live stats + chat + inventory
 */

// =============================================================================
// EXPRESS & SOCKET.IO SETUP
// =============================================================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.static('public'));

const PORT = 3000;

// =============================================================================
// ENHANCED LOGGING - CAPTURE EVERYTHING
// =============================================================================

const originalLog = console.log;
const originalError = console.error;

console.log = function(...args) {
  const message = args.join(' ');
  originalLog.apply(console, args);
  io.emit('terminal-output', { 
    type: 'log', 
    message,
    timestamp: new Date().toISOString()
  });
};

console.error = function(...args) {
  const message = args.join(' ');
  originalError.apply(console, args);
  io.emit('terminal-output', { 
    type: 'error', 
    message,
    timestamp: new Date().toISOString()
  });
};

// =============================================================================
// MINECRAFT BOT SETUP
// =============================================================================

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');
const Vec3 = require('vec3');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
require('dotenv').config();

const BOT_CONFIG = {
  host: 'localhost',
  port: 56272,
  username: 'Pengu',
};

const GAME_CONSTANTS = {
  SEARCH_RADIUS: 32,
  FOLLOW_DISTANCE: 2,
  ATTACK_RANGE: 4,
  ATTACK_INTERVAL: 500,
  CHEST_SEARCH_RADIUS: 6,
  COMBAT_RANGE: 32,
};

// =============================================================================
// OPENROUTER AI SETUP
// =============================================================================

const tools = [
  {
    type: "function",
    function: {
      name: "mine_block",
      description: "Mines blocks. Can mine multiple blocks if quantity specified.",
      parameters: {
        type: "object",
        properties: {
          block_name: { type: "string", description: "Block to mine (e.g., 'dirt', 'cobblestone', 'oak_log')" },
          quantity: { type: "number", description: "How many to mine (default: 1)" },
          chat_message: { type: "string", description: "Message to player" }
        },
        required: ["block_name", "chat_message"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "give_items",
      description: "Gives items from inventory to player",
      parameters: {
        type: "object",
        properties: {
          item_name: { type: "string", description: "Item to give" },
          quantity: { type: "number", description: "How many (default: all)" },
          chat_message: { type: "string", description: "Message to player" }
        },
        required: ["item_name", "chat_message"]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "follow_player",
      description: "Follows the player",
      parameters: {
        type: "object",
        properties: { chat_message: { type: "string" } },
        required: ["chat_message"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "build_house",
      description: "Builds proper house with oak logs, cobblestone, door, and oak planks",
      parameters: {
        type: "object",
        properties: { chat_message: { type: "string" } },
        required: ["chat_message"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "kill_mobs",
      description: "Attacks any mob - hostile or passive",
      parameters: {
        type: "object",
        properties: {
          mob_name: { type: "string", description: "Specific mob to kill" },
          chat_message: { type: "string" }
        },
        required: ["chat_message"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "stop_all",
      description: "Stops all tasks",
      parameters: {
        type: "object",
        properties: { chat_message: { type: "string" } },
        required: ["chat_message"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "stop_follow",
      description: "Stops following",
      parameters: {
        type: "object",
        properties: { chat_message: { type: "string" } },
        required: ["chat_message"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "report_status",
      description: "Reports health, hunger, inventory",
      parameters: {
        type: "object",
        properties: { chat_message: { type: "string" } },
        required: ["chat_message"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "stash_items",
      description: "Deposits items in nearby chest",
      parameters: {
        type: "object",
        properties: { chat_message: { type: "string" } },
        required: ["chat_message"]
      }
    }
  }
];

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = "openai/gpt-4o-mini";

async function askAI(message, username, context = '') {
  try {
    const systemPrompt = `You are a helpful Minecraft bot with personality. 
Short responses (1-2 sentences). When calling functions, ALWAYS include chat_message parameter.
Context: ${context}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `User ${username} says: ${message}` }
        ],
        tools: tools,
        tool_choice: 'auto'
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('API Error:', data.error);
      return { type: 'text', text: "Sorry, I had trouble processing that." };
    }

    const aiMessage = data.choices[0].message;
    
    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      const toolCall = aiMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);
      
      return { 
        type: 'function', 
        name: functionName,
        args: functionArgs,
        message: functionArgs.chat_message || null
      };
    } else {
      return { type: 'text', text: aiMessage.content };
    }
  } catch (error) {
    console.error('AI Error:', error);
    return { type: 'text', text: "Sorry, I had trouble understanding that." };
  }
}

// =============================================================================
// BOT INITIALIZATION
// =============================================================================

const bot = mineflayer.createBot(BOT_CONFIG);
bot.loadPlugin(pathfinder);

let activeTask = null;
let attackInterval = null;
let currentTarget = null;
let lastPlayerInteracted = null;
let lastHealthWarning = 0;
let respawnTarget = null;

// Helper function to emit bot stats
function emitBotStats() {
  try {
    const inventory = bot.inventory.items().map(item => ({
      name: item.name,
      count: item.count,
      displayName: item.displayName
    }));

    io.emit('bot-stats', {
      health: bot.health,
      food: bot.food,
      position: bot.entity.position,
      inventory: inventory,
      task: activeTask
    });
  } catch (err) {
    // Ignore errors during stats emission
  }
}

// Emit stats every 2 seconds
setInterval(() => {
  if (bot && bot.entity) {
    emitBotStats();
  }
}, 2000);

// =============================================================================
// SOCKET.IO HANDLERS
// =============================================================================

io.on('connection', (socket) => {
  console.log('🌐 Frontend connected!');

  // Send current bot state immediately
  socket.emit('bot-status', { 
    status: bot && bot.entity ? 'connected' : 'disconnected',
    message: bot && bot.entity ? 'Bot is online' : 'Bot is offline'
  });

  if (bot && bot.entity) {
    emitBotStats();
  }

  socket.on('player-message', async (message) => {
    try {
      console.log(`💬 Web message: ${message}`);
      
      const context = `Task: ${activeTask || 'idle'}. HP: ${Math.round(bot.health)}/20. Items: ${bot.inventory.items().length}`;
      const decision = await askAI(message, 'WebPlayer', context);

      if (decision.type === 'function') {
        const { name, args, message: aiMessage } = decision;
        console.log(`🔧 ${name}:`, args);

        if (aiMessage) {
          bot.chat(aiMessage);
          io.emit('chat-message', { username: 'bot', message: aiMessage, type: 'bot' });
        }

        // Execute function
        switch (name) {
          case 'mine_block':
            await executeMineTask(args.block_name, args.quantity || 1);
            break;
          case 'give_items':
            await giveItems('WebPlayer', args.item_name, args.quantity);
            break;

          case 'follow_player':
            executeFollowTask(lastPlayerInteracted || 'WebPlayer');
            break;
          case 'build_house':
            await buildHouse();
            break;
          case 'kill_mobs':
            await executeKillTask(args.mob_name || null);
            break;
          case 'stop_all':
            stopAllTasks();
            break;
          case 'stop_follow':
            stopFollow();
            break;
          case 'report_status':
            reportStatus();
            break;
          case 'stash_items':
            await depositItems();
            break;
          default:
            bot.chat("I'm not sure how to do that yet.");
        }
      } else {
        bot.chat(decision.text);
        io.emit('chat-message', { username: 'bot', message: decision.text, type: 'bot' });
      }
    } catch (err) {
      console.error('Message handling error:', err);
      io.emit('chat-message', { username: 'system', message: 'Error processing command', type: 'system' });
    }
  });

  socket.on('disconnect', () => {
    console.log('🌐 Frontend disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});

// =============================================================================
// BOT EVENT HANDLERS
// =============================================================================

bot.once('spawn', () => {
  console.log('🤖 Bot joined!');
  console.log(`📍 Position: ${bot.entity.position}`);
  
  io.emit('bot-status', { status: 'connected', message: 'Bot spawned!' });
  emitBotStats();
  
  // Initialize POV viewer on separate port
  try {
    mineflayerViewer(bot, { port: 3001, firstPerson: true });
    console.log('🎥 POV Viewer started on http://localhost:3001');
    io.emit('pov-ready', { port: 3001 });
  } catch (err) {
    console.error('POV Viewer failed:', err.message);
  }
  
  setTimeout(() => {
    if (lastPlayerInteracted) {
      navigateToPlayer();
    }
  }, 3000);
});

bot.on('chat', async (username, message) => {
  if (username === bot.username) return;
  
  console.log(`💬 ${username}: ${message}`);
  io.emit('chat-message', { username, message, type: 'player' });
  
  lastPlayerInteracted = username;

  try {
    const context = `Task: ${activeTask || 'idle'}. HP: ${Math.round(bot.health)}/20. Items: ${bot.inventory.items().length}`;
    const decision = await askAI(message, username, context);

    if (decision.type === 'function') {
      const { name, args, message: aiMessage } = decision;
      console.log(`🔧 ${name}:`, args);

      if (aiMessage) {
        bot.chat(aiMessage);
        io.emit('chat-message', { username: 'bot', message: aiMessage, type: 'bot' });
      }

      switch (name) {
        case 'mine_block':
          await executeMineTask(args.block_name, args.quantity || 1);
          break;
        case 'give_items':
          await giveItems(username, args.item_name, args.quantity);
          break;

        case 'follow_player':
          executeFollowTask(username);
          break;
        case 'build_house':
          await buildHouse();
          break;
        case 'kill_mobs':
          await executeKillTask(args.mob_name || null);
          break;
        case 'stop_all':
          stopAllTasks();
          break;
        case 'stop_follow':
          stopFollow();
          break;
        case 'report_status':
          reportStatus();
          break;
        case 'stash_items':
          await depositItems();
          break;
      }
    } else {
      bot.chat(decision.text);
      io.emit('chat-message', { username: 'bot', message: decision.text, type: 'bot' });
    }
  } catch (error) {
    console.error('Error:', error);
    bot.chat("Oops, something went wrong!");
  }
});

// Health updates
bot.on('health', () => {
  emitBotStats();
  
  if (bot.health < 6 && bot.health > 0) {
    console.log('❤️ Low health:', Math.round(bot.health));
    
    const now = Date.now();
    if (bot.health < 4 && activeTask === 'attacking' && now - lastHealthWarning > 10000) {
      bot.chat("I'm dying! Need help!");
      console.log('🚨 Critical health during combat');
      lastHealthWarning = now;
    }
  }
});

// Entity hurt - self defense
bot.on('entityHurt', (entity) => {
  if (entity === bot.entity) {
    console.log('🛡️ Bot hurt! HP:', bot.health);
    console.log('🔍 Searching for attacker...');
    console.log('📊 Current state - attackInterval:', !!attackInterval, 'activeTask:', activeTask);
    
    emitBotStats();
    
    const allNearby = Object.values(bot.entities).filter(e => {
      if (!e || !e.position) return false;
      const distance = bot.entity.position.distanceTo(e.position);
      return distance < 15 && e !== bot.entity;
    });
    
    console.log('🔎 ALL nearby entities:', allNearby.map(e => `${e.name || e.displayName || 'unknown'}[${e.type}](${Math.round(bot.entity.position.distanceTo(e.position))}m)`).join(', '));
    
    const hostileMobs = ['zombie', 'skeleton', 'creeper', 'spider', 'enderman', 'witch', 'slime', 'cave_spider', 'husk', 'stray', 'drowned', 'phantom', 'blaze', 'ghast'];
    
    const attacker = bot.nearestEntity(e => {
      if (!e || e === bot.entity) return false;
      if (!e.position) return false;
      
      const distance = bot.entity.position.distanceTo(e.position);
      if (distance > 15) return false;
      
      if (e.type !== 'mob' && e.type !== 'hostile') return false;
      
      const entityName = (e.name || '').toLowerCase();
      const displayName = e.displayName ? e.displayName.toLowerCase() : '';
      
      return hostileMobs.some(hostile => 
        entityName.includes(hostile) || displayName.includes(hostile)
      );
    });
    
    if (attacker) {
      const attackerName = attacker.name || attacker.displayName || 'unknown mob';
      console.log('⚔️ Found attacker:', attackerName, 'at', Math.round(bot.entity.position.distanceTo(attacker.position)), 'm');
      
      if (!attackInterval && activeTask !== 'attacking') {
        const defenseMessages = [
          "Hey! Not cool!",
          "Ouch! You're going down!",
          "Nobody hits me!",
          "Bad move!",
          "You picked the wrong bot!"
        ];
        const msg = defenseMessages[Math.floor(Math.random() * defenseMessages.length)];
        bot.chat(msg);
        io.emit('chat-message', { username: 'bot', message: msg, type: 'bot' });
        console.log('🎯 Starting combat against:', attackerName);
        executeKillTask(attackerName).catch(err => {
          console.error('Combat initiation failed:', err);
        });
      }
    } else {
      console.log('❌ No hostile attacker found nearby');
    }
  }
  
  // Player protection
  if (entity && entity.type === 'player' && entity !== bot.entity) {
    const playerName = entity.username;
    if (!playerName) return;
    
    console.log(`🛡️ Player ${playerName} hurt!`);
    emitBotStats();
    
    if (attackInterval || activeTask === 'attacking') {
      console.log('⏸️ Already in combat, can\'t help right now');
      return;
    }
    
    const hostileMobs = ['zombie', 'skeleton', 'creeper', 'spider', 'enderman', 'witch', 'slime', 'cave_spider', 'husk', 'stray', 'drowned', 'phantom', 'blaze', 'ghast'];
    
    const attacker = bot.nearestEntity(e => {
      if (!e || e === bot.entity) return false;
      if (!e.position || !entity.position) return false;
      
      const distance = entity.position.distanceTo(e.position);
      if (distance > 10) return false;
      
      if (e.type !== 'mob' && e.type !== 'hostile') return false;
      
      const entityName = (e.name || '').toLowerCase();
      const displayName = e.displayName ? e.displayName.toLowerCase() : '';
      
      return hostileMobs.some(hostile => 
        entityName.includes(hostile) || displayName.includes(hostile)
      );
    });
    
    if (attacker && bot.entity.position.distanceTo(attacker.position) < 32) {
      const attackerName = attacker.name || attacker.displayName || 'hostile mob';
      console.log(`🚨 Protecting ${playerName} from ${attackerName}!`);
      
      const protectMessages = [
        `I got your back, ${playerName}!`,
        `Don't worry, I'll handle this!`,
        `Nobody messes with you!`,
        `On it, ${playerName}!`
      ];
      
      const msg = protectMessages[Math.floor(Math.random() * protectMessages.length)];
      bot.chat(msg);
      io.emit('chat-message', { username: 'bot', message: msg, type: 'bot' });
      executeKillTask(attackerName).catch(err => {
        console.error('Protection combat failed:', err);
      });
    }
  }
});

bot.on('death', () => {
  console.log('💀 Bot died!');
  bot.chat("I died! Respawning...");
  
  io.emit('bot-status', { status: 'dead', message: 'Bot died!' });
  io.emit('chat-message', { username: 'system', message: 'Bot died!', type: 'system' });
  
  stopAllTasks();
  
  if (lastPlayerInteracted) {
    const player = bot.players[lastPlayerInteracted];
    if (player && player.entity && player.entity.position) {
      respawnTarget = {
        username: lastPlayerInteracted,
        position: player.entity.position.clone()
      };
      console.log(`📝 Will return to ${lastPlayerInteracted} at (${Math.round(respawnTarget.position.x)}, ${Math.round(respawnTarget.position.y)}, ${Math.round(respawnTarget.position.z)})`);
    }
  }
});

bot.on('respawn', async () => {
  console.log('♻️ Bot respawned!');
  
  io.emit('bot-status', { status: 'connected', message: 'Bot respawned!' });
  io.emit('chat-message', { username: 'system', message: 'Bot respawned!', type: 'system' });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  navigateToPlayer();
  emitBotStats();
});

async function navigateToPlayer() {
  if (respawnTarget) {
    const targetPlayer = respawnTarget.username;
    const targetPos = respawnTarget.position;
    
    const player = bot.players[targetPlayer];
    let destination = targetPos;
    
    if (player && player.entity && player.entity.position) {
      destination = player.entity.position;
      console.log(`🏃 Going to ${targetPlayer}'s current position (${Math.round(destination.x)}, ${Math.round(destination.y)}, ${Math.round(destination.z)})`);
    } else {
      console.log(`🏃 Going to ${targetPlayer}'s last position (${Math.round(destination.x)}, ${Math.round(destination.y)}, ${Math.round(destination.z)})`);
    }
    
    bot.chat(`On my way back, ${targetPlayer}!`);
    io.emit('chat-message', { username: 'bot', message: `On my way back, ${targetPlayer}!`, type: 'bot' });
    
    try {
      const mcDataVersioned = mcData(bot.version);
      const movements = new Movements(bot, mcDataVersioned);
      movements.canDig = true;
      movements.allowSprinting = true;
      
      bot.pathfinder.setMovements(movements);
      const goal = new goals.GoalNear(destination.x, destination.y, destination.z, 3);
      await bot.pathfinder.goto(goal);
      
      bot.chat("I'm back! 👋");
      io.emit('chat-message', { username: 'bot', message: "I'm back! 👋", type: 'bot' });
      console.log('✓ Arrived at destination');
    } catch (err) {
      console.error('Failed to navigate to player:', err);
      bot.chat("I respawned but couldn't reach you!");
    }
    
    respawnTarget = null;
  } else if (lastPlayerInteracted) {
    const player = bot.players[lastPlayerInteracted];
    if (player && player.entity && player.entity.position) {
      bot.chat(`Coming to you, ${lastPlayerInteracted}!`);
      io.emit('chat-message', { username: 'bot', message: `Coming to you, ${lastPlayerInteracted}!`, type: 'bot' });
      console.log(`🏃 Going to ${lastPlayerInteracted}`);
      
      try {
        const mcDataVersioned = mcData(bot.version);
        const movements = new Movements(bot, mcDataVersioned);
        movements.canDig = true;
        movements.allowSprinting = true;
        
        bot.pathfinder.setMovements(movements);
        const goal = new goals.GoalNear(
          player.entity.position.x,
          player.entity.position.y,
          player.entity.position.z,
          3
        );
        await bot.pathfinder.goto(goal);
        
        bot.chat("Found you! 👋");
        io.emit('chat-message', { username: 'bot', message: "Found you! 👋", type: 'bot' });
        console.log('✓ Found player');
      } catch (err) {
        console.error('Failed to find player:', err);
      }
    }
  }
}

bot.on('error', (err) => console.error('❌ Bot error:', err));
bot.on('end', () => {
  console.log('🔌 Bot disconnected');
  io.emit('bot-status', { status: 'disconnected', message: 'Bot disconnected' });
});

// =============================================================================
// TASK FUNCTIONS
// =============================================================================

async function executeMineTask(blockName, quantity = 1) {
  try {
    if (!blockName) {
      bot.chat("What should I mine?");
      return;
    }

    // Prevent duplicate mining tasks
    if (activeTask === 'mining') {
      console.log('⏸️ Already mining, skipping duplicate request');
      return;
    }

    const mcDataVersioned = mcData(bot.version);
    const blockType = mcDataVersioned.blocksByName[blockName];

    if (!blockType) {
      bot.chat(`I don't know what "${blockName}" is.`);
      return;
    }

    activeTask = 'mining';
    console.log(`⛏️ Mining ${quantity}x ${blockName}`);
    emitBotStats();

    let mined = 0;
    while (mined < quantity) {
      const block = bot.findBlock({
        matching: blockType.id,
        maxDistance: GAME_CONSTANTS.SEARCH_RADIUS
      });

      if (!block) {
        bot.chat(`Only found ${mined}/${quantity} ${blockName}.`);
        break;
      }

      const movements = new Movements(bot, mcDataVersioned);
      movements.canDig = true;
      bot.pathfinder.setMovements(movements);
      
      await bot.pathfinder.goto(new goals.GoalBlock(block.position.x, block.position.y, block.position.z));
      await bot.dig(block);
      mined++;
      
      console.log(`⛏️ Mined ${mined}/${quantity} ${blockName}`);
      emitBotStats();
      
      if (mined < quantity) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    bot.chat(`Got ${mined}x ${blockName}! ✓`);
    io.emit('chat-message', { username: 'bot', message: `Got ${mined}x ${blockName}! ✓`, type: 'bot' });
    activeTask = null;
    emitBotStats();
  } catch (error) {
    console.error('Mine error:', error);
    bot.chat("Mining failed!");
    activeTask = null;
    emitBotStats();
  }
}

async function giveItems(username, itemName, quantity) {
  try {
    const player = bot.players[username];
    if (!player || !player.entity) {
      bot.chat("Come closer so I can give you items!");
      return;
    }

    const items = bot.inventory.items().filter(item => 
      item.name.toLowerCase().includes(itemName.toLowerCase())
    );

    if (items.length === 0) {
      bot.chat(`I don't have any ${itemName}!`);
      return;
    }

    let totalGiven = 0;
    const targetQty = quantity || items.reduce((sum, item) => sum + item.count, 0);

    for (const item of items) {
      const toGive = quantity ? Math.min(item.count, targetQty - totalGiven) : item.count;
      if (toGive <= 0) break;

      await bot.toss(item.type, null, toGive);
      totalGiven += toGive;
    }

    bot.chat(`Gave you ${totalGiven}x ${itemName}! ✓`);
    io.emit('chat-message', { username: 'bot', message: `Gave you ${totalGiven}x ${itemName}! ✓`, type: 'bot' });
    emitBotStats();
  } catch (error) {
    console.error('Give error:', error);
    bot.chat("Couldn't give items!");
  }
}


function executeFollowTask(username) {
  try {
    const player = bot.players[username];
    if (!player || !player.entity) {
      bot.chat(`Can't see you, ${username}!`);
      return;
    }

    activeTask = 'following';
    console.log(`👣 Following ${username}`);
    emitBotStats();

    const mcDataVersioned = mcData(bot.version);
    const movements = new Movements(bot, mcDataVersioned);
    movements.canDig = true;
    movements.allow1by1towers = false;

    bot.pathfinder.setMovements(movements);
    bot.pathfinder.setGoal(new goals.GoalFollow(player.entity, GAME_CONSTANTS.FOLLOW_DISTANCE), true);
  } catch (error) {
    console.error('Follow error:', error);
    bot.chat("Can't follow you!");
  }
}

function stopFollow() {
  bot.pathfinder.setGoal(null);
  if (activeTask === 'following') activeTask = null;
  console.log('⏹️ Stopped following');
  emitBotStats();
}

function stopAllTasks() {
  bot.pathfinder.setGoal(null);
  bot.clearControlStates();
  
  if (attackInterval) {
    clearInterval(attackInterval);
    attackInterval = null;
  }
  
  if (currentTarget) currentTarget = null;
  activeTask = null;
  console.log('🛑 All tasks stopped');
  emitBotStats();
}

function reportStatus() {
  try {
    const health = Math.round(bot.health);
    const food = Math.round(bot.food);
    const inv = getInventoryList();
    const pos = bot.entity.position;
    
    bot.chat(`❤️ ${health}/20 HP | 🍗 ${food}/20 Food`);
    bot.chat(`🎒 ${inv}`);
    bot.chat(`📍 X:${Math.round(pos.x)} Y:${Math.round(pos.y)} Z:${Math.round(pos.z)}`);
    
    io.emit('chat-message', { username: 'bot', message: `❤️ ${health}/20 HP | 🍗 ${food}/20 Food`, type: 'bot' });
    io.emit('chat-message', { username: 'bot', message: `🎒 ${inv}`, type: 'bot' });
    io.emit('chat-message', { username: 'bot', message: `📍 X:${Math.round(pos.x)} Y:${Math.round(pos.y)} Z:${Math.round(pos.z)}`, type: 'bot' });
    
    emitBotStats();
  } catch (error) {
    console.error('Status error:', error);
  }
}

function getInventoryList() {
  const items = bot.inventory.items();
  if (items.length === 0) return "Empty";
  
  const counts = {};
  items.forEach(item => {
    const name = item.displayName || item.name;
    counts[name] = (counts[name] || 0) + item.count;
  });
  
  return Object.entries(counts)
    .map(([name, count]) => `${name} x${count}`)
    .join(', ');
}

async function executeKillTask(mobName = null) {
  try {
    if (attackInterval) {
      console.log('⏸️ Already in combat');
      return;
    }

    activeTask = 'attacking';
    console.log(`⚔️ Starting combat${mobName ? ` against ${mobName}` : ''}`);
    emitBotStats();

    const hostileMobs = ['zombie', 'skeleton', 'creeper', 'spider', 'enderman', 'witch', 'slime', 'cave_spider', 'husk', 'stray', 'drowned', 'phantom', 'blaze', 'ghast'];
    const passiveMobs = ['cow', 'pig', 'sheep', 'chicken', 'rabbit', 'horse', 'donkey', 'llama'];

    attackInterval = setInterval(async () => {
      try {
        let target;

        if (mobName) {
          target = bot.nearestEntity(e => {
            if (!e || e === bot.entity || !e.position) return false;
            const distance = bot.entity.position.distanceTo(e.position);
            if (distance > GAME_CONSTANTS.COMBAT_RANGE) return false;
            if (e.type !== 'mob' && e.type !== 'hostile') return false;

            const entityName = (e.name || '').toLowerCase();
            const displayName = e.displayName ? e.displayName.toLowerCase() : '';
            const targetName = mobName.toLowerCase();

            return entityName.includes(targetName) || displayName.includes(targetName);
          });
        } else {
          target = bot.nearestEntity(e => {
            if (!e || e === bot.entity || !e.position) return false;
            const distance = bot.entity.position.distanceTo(e.position);
            if (distance > GAME_CONSTANTS.COMBAT_RANGE) return false;
            if (e.type !== 'mob' && e.type !== 'hostile') return false;

            const entityName = (e.name || '').toLowerCase();
            const displayName = e.displayName ? e.displayName.toLowerCase() : '';

            return hostileMobs.some(hostile => entityName.includes(hostile) || displayName.includes(hostile));
          });
        }

        if (!target) {
          console.log('✓ No more targets found');
          clearInterval(attackInterval);
          attackInterval = null;
          activeTask = null;
          bot.pathfinder.setGoal(null);
          bot.chat("All clear!");
          io.emit('chat-message', { username: 'bot', message: "All clear!", type: 'bot' });
          emitBotStats();
          return;
        }

        currentTarget = target;
        const distance = bot.entity.position.distanceTo(target.position);

        if (distance > GAME_CONSTANTS.ATTACK_RANGE) {
          const mcDataVersioned = mcData(bot.version);
          const movements = new Movements(bot, mcDataVersioned);
          movements.canDig = false;
          movements.allowSprinting = true;
          bot.pathfinder.setMovements(movements);
          bot.pathfinder.setGoal(new goals.GoalFollow(target, GAME_CONSTANTS.ATTACK_RANGE - 1), true);
        } else {
          bot.pathfinder.setGoal(null);

          const weapon = bot.inventory.items().find(item =>
            item.name.includes('sword') || item.name.includes('axe')
          );

          if (weapon) await bot.equip(weapon, 'hand');

          await bot.lookAt(target.position.offset(0, target.height * 0.9, 0));
          await bot.attack(target);

          console.log(`⚔️ Attacked ${target.name || target.displayName || 'mob'} (${Math.round(distance)}m)`);
        }
      } catch (err) {
        console.error('Combat error:', err);
      }
    }, GAME_CONSTANTS.ATTACK_INTERVAL);

  } catch (error) {
    console.error('Kill task error:', error);
    activeTask = null;
    if (attackInterval) {
      clearInterval(attackInterval);
      attackInterval = null;
    }
    emitBotStats();
  }
}

// =============================================================================
// HOUSE BUILDING (PROPER) - FIXED TO PREVENT SELF-OBSTRUCTION
// =============================================================================

async function buildHouse() {
  try {
    activeTask = 'building';
    const mcDataVersioned = mcData(bot.version);

    // Find build spot away from bot's current position
    const startPos = findBuildSpot();
    
    const width = 5;
    const depth = 5;
    const height = 4;
    
    // CRITICAL FIX: Move bot to safe observation position OUTSIDE the build area
    // This prevents the bot from being stuck inside walls during construction
    const safeSpot = startPos.offset(width + 3, 0, Math.floor(depth / 2));
    bot.chat("Moving to safe position...");
    
    try {
      await bot.pathfinder.goto(new goals.GoalNear(safeSpot.x, safeSpot.y, safeSpot.z, 1));
      console.log("✓ Bot positioned safely outside build area");
    } catch (err) {
      console.log("⚠️ Couldn't reach ideal spot, continuing from current position");
    }
    
    bot.chat("Clearing area...");
    await clearBuildArea(startPos, width, depth);
    
    bot.chat("Building house...");

    // Track scaffold blocks for cleanup
    const scaffoldBlocks = [];

    // FLOOR
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        await placeBlockSmart(startPos.offset(x, 0, z), 'oak_planks', mcDataVersioned);
      }
    }

    // WALLS
    for (let y = 1; y <= height; y++) {
      for (let x = 0; x < width; x++) {
        for (let z = 0; z < depth; z++) {
          const isWall = x === 0 || x === width - 1 || z === 0 || z === depth - 1;
          if (!isWall) continue;

          // Door gap
          if (z === 0 && x === 2 && y <= 2) continue;

          const isCorner = (x === 0 || x === width - 1) && (z === 0 || z === depth - 1);
          const mat = isCorner ? 'oak_log' : 'cobblestone';

          await placeBlockSmart(startPos.offset(x, y, z), mat, mcDataVersioned);
        }
      }
    }

    // ROOF
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        await placeBlockSmart(startPos.offset(x, height + 1, z), 'cobblestone', mcDataVersioned);
      }
    }

    // CLEANUP: Remove any scaffolding/support blocks inside the house
    bot.chat("Cleaning up...");
    await cleanupScaffold(startPos, width, depth, height);

    bot.chat("House complete! 🏠");
    activeTask = null;

  } catch (err) {
    console.error("Build failed:", err);
    bot.chat("Building failed.");
    activeTask = null;
  }
}

function findBuildSpot() {
  // Find spot offset from bot to avoid building where bot is standing
  const base = bot.entity.position.offset(6, 0, 0).floored();

  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      const ground = bot.blockAt(base.offset(x, -1, z));
      const air = bot.blockAt(base.offset(x, 0, z));

      if (ground && ground.name !== 'air' && air && air.name === 'air') {
        return base.offset(x, 0, z);
      }
    }
  }

  return base;
}

async function clearBlockIfNeeded(pos) {
  const block = bot.blockAt(pos);
  if (!block) return;

  // Ignore air
  if (block.name === 'air') return;

  // Ignore unbreakable
  if (!bot.canDigBlock(block)) return;

  try {
    await bot.dig(block, true);
  } catch {}
}

async function placeBlockSmart(pos, itemName, mcDataVersioned) {
  try {
    // 1️⃣ Clear space first (grass, flowers, etc.)
    await clearBlockIfNeeded(pos);

    const blockHere = bot.blockAt(pos);
    if (!blockHere || blockHere.name !== 'air') return;

    const item = bot.inventory.items().find(i => i.name === itemName);
    if (!item) return; // Skip instead of throwing error

    await bot.equip(item, 'hand');

    // 2️⃣ Try placement from current position first (no movement = faster)
    const faces = [
      new Vec3(0, -1, 0),
      new Vec3(1, 0, 0),
      new Vec3(-1, 0, 0),
      new Vec3(0, 0, 1),
      new Vec3(0, 0, -1),
    ];

    for (const face of faces) {
      const ref = bot.blockAt(pos.plus(face));
      if (!ref || ref.name === 'air') continue;

      try {
        await bot.placeBlock(ref, face.scaled(-1));
        return; // Success! Exit immediately
      } catch {}
    }

    // 3️⃣ Only move if we couldn't place from current position
    const dist = bot.entity.position.distanceTo(pos);
    if (dist > 4.5) {
      await bot.pathfinder.goto(new goals.GoalNear(pos.x, pos.y, pos.z, 3));
    }

    // 4️⃣ Try again after moving
    for (const face of faces) {
      const ref = bot.blockAt(pos.plus(face));
      if (!ref || ref.name === 'air') continue;

      try {
        await bot.placeBlock(ref, face.scaled(-1));
        return;
      } catch {}
    }

    // 5️⃣ Last resort: scaffold up (only if really needed)
    const ref = bot.blockAt(pos.offset(0, -1, 0));
    if (!ref || ref.name === 'air') return;

    bot.setControlState('jump', true);
    await new Promise(resolve => setTimeout(resolve, 50)); // Minimal delay
    try {
      await bot.placeBlock(ref, new Vec3(0, 1, 0));
    } catch {}
    bot.setControlState('jump', false);
  } catch (err) {
    // Silent fail - keep building
  }
}

async function clearBuildArea(startPos, width, depth, height = 5) {
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < depth; z++) {
      for (let y = 0; y <= height; y++) {
        await clearBlockIfNeeded(startPos.offset(x, y, z));
      }
    }
  }
}

async function cleanupScaffold(startPos, width, depth, height) {
  // Remove any blocks inside the house that aren't part of the design
  for (let x = 1; x < width - 1; x++) {
    for (let z = 1; z < depth - 1; z++) {
      for (let y = 1; y <= height; y++) {
        const pos = startPos.offset(x, y, z);
        const block = bot.blockAt(pos);
        
        // Remove any blocks inside (these are scaffolds/supports)
        if (block && block.name !== 'air' && bot.canDigBlock(block)) {
          try {
            const dist = bot.entity.position.distanceTo(pos);
            if (dist > 5) {
              await bot.pathfinder.goto(new goals.GoalNear(pos.x, pos.y, pos.z, 3));
            }
            await bot.dig(block, true);
          } catch (err) {
            // Continue even if we can't break a block
          }
        }
      }
    }
  }
}


console.log('🚀 Bot loading...');
