import { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
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
    console.error('Error registering command:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'rule34') return;

  const tags = interaction.options.getString('tags', true);
  const isNSFW = (interaction.channel as any).nsfw;

  if (!isNSFW) {
    return interaction.reply({ content: '⚠️ This command can only be used in NSFW channels.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    const url = `https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100&tags=${encodeURIComponent(tags)}`;
    const res = await axios.get(url);
    const parser = new XMLParser();
    const data = parser.parse(res.data);

    const posts = data?.posts?.post;
    if (!posts || posts.length === 0) {
      return interaction.editReply('❌ No results found.');
    }

    const post = Array.isArray(posts)
      ? posts[Math.floor(Math.random() * posts.length)]
      : posts;

    const imageUrl = post?.file_url?.startsWith('http')
      ? post.file_url
      : `https://rule34.xxx/${post.file_url}`;

    const embed = new EmbedBuilder()
      .setTitle('🔞 Rule34 Result')
      .setURL(`https://rule34.xxx/index.php?page=post&s=view&id=${post.id}`)
      .setImage(imageUrl)
      .setFooter({ text: `Tags: ${tags.replace(/\+/g, ' ')}` });

    interaction.editReply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    interaction.editReply('❌ Failed to fetch results.');
  }
});

client.login(process.env.DISCORD_TOKEN);

