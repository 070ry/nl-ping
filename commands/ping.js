module.exports = {
    data: {
      name: 'ping',
      description: 'BotのPingを表示します'
    },
    execute(interaction, client) {
      interaction.reply(`Websocket Ping: ${client.ws.ping}ms\nInteraction.CreatedTimestamp Ping: ${Date.now() - interaction.createdTimestamp}ms`);
    }
  };
  