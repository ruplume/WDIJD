import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Routes,
  REST,
  EmbedBuilder,
  MessageFlags
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

  const tags = interaction.options.getString('tags', true);
  const isNSFW = (interaction.channel as any).nsfw;

  if (!isNSFW) {
    return interaction.reply({
      content: '⚠️ This command can only be used in NSFW channels.',
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.deferReply();

  try {
    const url = `https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100&tags=${encodeURIComponent(tags)}`;
    const res = await axios.get(url);
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(res.data);

    const posts = data?.posts?.post;
    if (!posts || posts.length === 0) {
      return interaction.editReply('❌ No results found.');
    }

    const results = Array.isArray(posts) ? posts : [posts];

    // Filter for image-only posts
    const imagePosts = results.filter((post: any) => {
      const url = post['@_file_url'];
      return url && (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.jpeg'));
    });

    if (imagePosts.length === 0) {
      return interaction.editReply('❌ No image posts found (videos were skipped).');
    }

    const post = imagePosts[Math.floor(Math.random() * imagePosts.length)];
    const imageUrl = post['@_file_url'];
    const postId = post['@_id'];

    const embed = new EmbedBuilder()
      .setTitle('🔞 Rule34 Result')
      .setURL(`https://rule34.xxx/index.php?page=post&s=view&id=${postId}`)
      .setImage(imageUrl)
      .setFooter({ text: `Tags: ${tags.replace(/\+/g, ' ')}` });

    interaction.editReply({ embeds: [embed] });
  } catch (err) {
    console.error('❌ API error:', err);
    interaction.editReply('❌ Failed to fetch results from Rule34.');
  }
});

client.login(process.env.DISCORD_TOKEN);
