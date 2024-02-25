const { Client, IntentsBitField, Partials } = require("discord.js");
const WOK = require("wokcommands");
const { DefaultCommands } = WOK;
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildInvites,
	],
	partials: [Partials.Channel],
});

client.on("ready", async () => {
	console.log("running");

	new WOK({
		client,
		commandsDir: path.join(__dirname, "./commands"),
		// featuresDir: path.join(__dirname, "features"),
		events: {
			dir: path.join(__dirname, "events"),
		},

		disabledDefaultCommands: [
			DefaultCommands.ChannelCommand,
			DefaultCommands.CustomCommand,
			DefaultCommands.Prefix,
			DefaultCommands.RequiredPermissions,
			DefaultCommands.RequiredRoles,
			DefaultCommands.ToggleCommand,
		],
		cooldownConfig: {
			errorMessage: "Please wait {TIME} before doing that again.",
			botOwnersBypass: false,
			dbRequired: 300,
		},
	});
});

client.login(process.env.TOKEN);
