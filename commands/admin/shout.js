/*
  Description: Emmits a server-wide message as `info`
*/

import {
  isAdmin,
} from '../utility/_UAC';

// module main
export async function run({ server, socket, payload }) {
  // increase rate limit chance and ignore if not admin
  if (!isAdmin(socket.level)) {
    return server.police.frisk(socket.address, 20);
  }

  // send text to all channels
  server.broadcast({
    cmd: 'info',
    text: `Server Notice: ${payload.text}`,
    channel: false, // @todo Multichannel, false for global
  }, {});

  return true;
}

export const requiredData = ['text'];
export const info = {
  name: 'shout',
  description: 'Displays passed text to every client connected',
  usage: `
    API: { cmd: 'shout', text: '<shout text>' }`,
};
