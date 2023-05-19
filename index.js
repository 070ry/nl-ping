const { Client, Discord, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
});
const axios = require('axios');
const moment = require('moment')
const fs = require('fs')

require('dotenv').config();

const prefix = process.env.prefix
const token = process.env.token
const version = process.env.version

//slash command
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} V:${version}`);
  client.guilds.cache.forEach(guild => {
    guild.commands.set(client.commands.map(cmd => cmd.data));
  });
  setInterval(() => {
    client.user.setActivity({
      name: `${prefix}help Version:${version} Ping:${client.ws.ping}ms`,
      status: "online"
    })
  }, 10000)
});

client.on('interactionCreate', interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(`${prefix}ping`)) {
    message.reply(`現在のPing: ${client.ws.ping}ms`)
  };
  if (message.content.startsWith(`${prefix}help`)) {

    const help = new EmbedBuilder()
      .setColor(`${message.member.displayHexColor}`)
      .setAuthor({ name: client.user.tag, iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512` })
      .addFields(
        { name: prefix + `stats`, value: `このbotのメインの機能です。Neverland RPGの参加人数などを確認できます。`, inline: false },
        { name: prefix + `crash`, value: `botに不具合がある場合にbotを停止して再起動させるためのコマンドです。`, inline: false },
        { name: prefix + `info`, value: `NeverlandRPGの情報を表示するかと思いきやユーザーの情報を表示します。なお、まだ他人のものは見れない模様。`, inline: false },
        { name: prefix + `help`, value: `このメッセージを表示します。`, inline: false },
        { name: `公式ページ`, value: `https://onews.f5.si/discord/nl`, inline: false }
      )
      .setTimestamp()
      .setImage(`https://pbs.twimg.com/profile_images/1322577789824851968/DRINrc2m_400x400.png`)
    message.reply({ embeds: [help] });
  };
  if (message.content === prefix + 'source') {
    message.reply('**ソースコード**:\nRepo:https://github.com/070ry/nl-ping-bot')
  };
  if (message.content === prefix + 'crash') {
    await message.channel.send('Botを再起動/停止します。')
    await client.user.setActivity({
      name: `Botを再起動中です...`,
      status: "dnd"
    })
    process.exit()
  };
  if (message.content === prefix + 'stats') {
    try {
      const sentMessage = await message.channel.send('取得しています...');
      const response = await axios.get('https://api.mcstatus.io/v2/status/java/nl-rpg.mcpe.me:25566');
      const data = response.data;

      const { online, players } = data;
      const { online: playersOnline, max: playersMax } = players;
      console.log(`${message.author.tag} used stats | Neverland Stats | Up: ${online ? 'Yes' : 'No'} Online:${playersOnline}/${playersMax}`)
      sentMessage.edit(`<:nlrpg:1106141101762564156>Neverland RPG(\`nl-rpg.mcpe.me:25566\`)\nオンライン: ${online ? 'はい' : 'いいえ'} 人数: ${playersOnline}人がオンライン (Max: ${playersMax})`)
    } catch (error) {
      console.error('An error occurred:', error);
      message.send('サーバーステータスの取得に失敗しました。');
    }
  };
  if (message.content === prefix) {
    message.reply(`このサーバーでのprefixは\`${prefix}\`です。(現在prefixを変更する方法はありません。)`)
  }
  if (message.content === prefix + 'nl') {
    message.reply('<:nlrpg:1106141101762564156>Neverland RPG\nDiscord Server: https://discord.gg/n97aFCv99z \nServer IP: Java IP `nl-rpg.mcpe.me:25566`, Bedrock IP `nl-rpg.mcpe.me` Port `19132` ')
  };
});


client.login(token);