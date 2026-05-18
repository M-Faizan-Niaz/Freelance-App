export const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  QUICK_REPLY: 'quick_reply',
} as const;

export type MessageTypeName = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
