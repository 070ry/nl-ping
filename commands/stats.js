const axios = require('axios');
module.exports = {
    data: {
        name: 'stats',
        description: 'Neverland RPGにPingを送信します。'
    },
    async execute(interaction, client) {
        await interaction.reply(`取得しています...`);
        const response = await axios.get('https://api.mcstatus.io/v2/status/java/nl-rpg.mcpe.me:25566');
        const data = await response.data;
        const { online, players } = await data;
        const { online: playersOnline, max: playersMax } = await players;
        await console.log(`${interaction.user.tag} used stats | Neverland Stats | Up: ${online ? 'Yes' : 'No'} Online:${playersOnline}/${playersMax}`);
        await interaction.editReply(`Neverland RPG(\`nl-rpg.mcpe.me:25566\`)\nオンライン: ${online ? 'はい' : 'いいえ'} 人数: ${playersOnline}人がオンライン (Max: ${playersMax})`);
    }
};
