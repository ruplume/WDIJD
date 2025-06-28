import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Routes,
  REST,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponseFlags
} from 'discord.js';

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const command = new SlashCommandBuilder()
  .setName('rule34')
  .setDescription('Search Rule34.xxx with tags')
  .addStringOption(option =>
    option.setName('tags')
      .setDescription('Tags to search (e.g. samus_aran)')
      .setRequired(true)
  );

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);

  try {
    await rest.put(
      Routes.applicationCommands(client.user!.id),
      { body: [command.toJSON()] }
    );
    console.log('✅ Slash command registered.');
  } catch (error) {
    console.error('❌ Error registering command:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'rule34') return;

  const tags = interaction.options.getString('tags', tr
