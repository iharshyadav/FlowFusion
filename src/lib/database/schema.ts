import mongoose from "mongoose"
const { Schema } = mongoose;

const UserSchema = new Schema({
  clerkId: { type: String, unique: true, required: true },
  name: { type: String },
  email: { type: String, unique: true, required: true },
  profileImage: { type: String },
  tier: { type: String, default: "Free" },
  credits: { type: String, default: "10" },
  localGoogleId: { type: String, unique: true },
  googleResourceId: { type: String, unique: true },
  localGoogleCredential: {
    type: Schema.Types.ObjectId,
    ref: "LocalGoogleCredential",
  },
  discordWebhooks: [{ type: Schema.Types.String, ref: "DiscordWebhook" }],
  notions: [{ type: Schema.Types.String, ref: "Notion" }],
  slacks: [{ type: Schema.Types.String, ref: "Slack" }],
  connections: [{ type: Schema.Types.String, ref: "Connections" }],
  workflows: [{ type: Schema.Types.String, ref: "Workflows" }],
});

const LocalGoogleCredentialSchema = new Schema({
  accessToken: { type: String, unique: true, required: true },
  folderId: { type: String },
  pageToken: { type: String },
  channelId: { type: String, unique: true, default: () => new mongoose.Types.ObjectId() },
  subscribed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true }
});

const DiscordWebhookSchema = new Schema({
  webhookId: { type: String, unique: true, required: true },
  url: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  guildName: { type: String, required: true },
  guildId: { type: String, required: true },
  channelId: { type: String, unique: true, required: true },
  userId: { type: Schema.Types.String, ref: 'User', required: true },
  connections: [{ type: Schema.Types.String, ref: 'Connections' }]
});

const SlackSchema = new Schema({
  appId: { type: String, required: true },
  authedUserId: { type: String, required: true },
  authedUserToken: { type: String, unique: true, required: true },
  slackAccessToken: { type: String, unique: true, required: true },
  botUserId: { type: String, required: true },
  teamId: { type: String, required: true },
  teamName: { type: String, required: true },
  userId: { type: Schema.Types.String, ref: 'User', required: true },
  connections: [{ type: Schema.Types.String, ref: 'Connections' }]
});

const NotionSchema = new Schema({
  accessToken: { type: String, unique: true, required: true },
  workspaceId: { type: String, unique: true, required: true },
  databaseId: { type: String, unique: true, required: true },
  workspaceName: { type: String, required: true },
  workspaceIcon: { type: String, required: true },
  userId: { type: Schema.Types.String, ref: 'User', required: true },
  connections: [{ type: Schema.Types.String, ref: 'Connections' }]
});

const ConnectionsSchema = new Schema({
  type: { type: String, unique: true, required: true },
  discordWebhookId: { type: Schema.Types.String, ref: 'DiscordWebhook' },
  notionId: { type: Schema.Types.String, ref: 'Notion' },
  userId: { type: Schema.Types.String, ref: 'User' },
  slackId: { type: Schema.Types.String, ref: 'Slack' }
});

const WorkflowsSchema = new Schema({
  nodes: { type: String },
  edges: { type: String },
  name: { type: String, required: true },
  discordTemplate: { type: String },
  notionTemplate: { type: String },
  slackTemplate: { type: String },
  slackChannels: { type: [String] },
  slackAccessToken: { type: String },
  notionAccessToken: { type: String },
  notionDbId: { type: String },
  flowPath: { type: String },
  cronPath: { type: String },
  publish: { type: Boolean, default: false },
  description: { type: String, required: true },
  userId: { type: Schema.Types.String, ref: 'User', required: true }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const LocalGoogleCredential = mongoose.models.LocalGoogleCredential || mongoose.model('LocalGoogleCredential', LocalGoogleCredentialSchema);
export const DiscordWebhook = mongoose.models.DiscordWebhook || mongoose.model('DiscordWebhook', DiscordWebhookSchema);
export const Slack = mongoose.models.Slack || mongoose.model('Slack', SlackSchema);
export const Notion = mongoose.models.Notion || mongoose.model('Notion', NotionSchema);
export const Connections = mongoose.models.Connections || mongoose.model('Connections', ConnectionsSchema);
export const Workflows = mongoose.models.Workflows || mongoose.model('Workflows', WorkflowsSchema);
