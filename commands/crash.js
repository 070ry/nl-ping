const owner = [
    "649922410103046145",
    "880410653058289685",
    "1072283404722257950"
  ]
module.exports = {
    data: {
      name: 'crash',
      description: 'Botを停止します。',
    },
    execute(interaction, client) {
        const user = interaction.user;
        if (owner.includes(user.id)) {
        interaction.reply({ content: 'Botを停止しています。', ephemeral: true });
        process.exit();
        } else {
            interaction.reply({ content: '権限がありません。', ephemeral: true });
        }

    }
  };
  