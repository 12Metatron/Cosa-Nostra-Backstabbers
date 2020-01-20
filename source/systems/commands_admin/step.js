module.exports = async function (message, params, config) {

  if (!process.game || !["pre-game", "playing"].includes(process.game.state)) {
    await message.channel.send(":x: No game in progress.");
    return null;
  };

  await message.channel.send(":ok: Setting a step in the Timer.");
  process.game.timer.step();

};
