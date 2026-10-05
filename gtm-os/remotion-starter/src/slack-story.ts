// Frame times and targets are shared by the mock UI and cursor.
export const slackEvents = {
  type: 12,
  send: 90,
  thread: 126,
  progress: 180,
  draft: 270,
  approve: 330,
  saved: 390,
  reply: 438,
  reaction: 480,
};
export const slackGeometry = {
  sidebar: 288,
  threadX: 1110,
  header: 86,
  send: {x: 1028, y: 960},
  thread: {x: 450, y: 462},
  approve: {x: 1326, y: 648},
};
export const slackContent = {
  workspace: 'Demo workspace',
  channel: 'launch-studio',
  human: 'Avery',
  agent: 'Scout',
  colleague: 'Morgan',
  request: 'Scout, turn release-notes.md into a launch brief.',
  note: 'Illustrative Slack UI • Synthetic content • No live API calls',
};
