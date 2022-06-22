/*
  Description: Clears and resets the command modules, outputting any errors
*/

import {
  isAdmin,
  isModerator,
} from '../utility/_UAC';

// module main
export async function run({
  core, server, socket, payload,
}) {
  // increase rate limit chance and ignore if not admin
  if (!isAdmin(socket.level)) {
    return server.police.frisk(socket.address, 20);
  }

  // do command reload and store results
  let loadResult = core.dynamicImports.reloadDirCache();
  loadResult += core.commands.loadCommands();

  // clear and rebuild all module hooks
  server.loadHooks();

  // build reply based on reload results
  if (loadResult === '') {
    loadResult = `Reloaded ${core.commands.commands.length} commands, 0 errors`;
  } else {
    loadResult = `Reloaded ${core.commands.commands.length} commands, error(s):
      ${loadResult}`;
  }

  if (typeof payload.reason !== 'undefined') {
    loadResult += `\nReason: ${payload.reason}`;
  }

  // send results to moderators (which the user using this command is higher than)
  server.broadcast({
    cmd: 'info',
    text: loadResult,
    channel: false, // @todo Multichannel, false for global
  }, { level: isModerator });

  return true;
}

export const info = {
  name: 'reload',
  description: '(Re)loads any new commands into memory, outputs errors if any',
  usage: `
    API: { cmd: 'reload', reason: '<optional reason append>' }`,
};
