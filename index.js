const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    AttachmentBuilder
 } = require('discord.js');
require('dotenv').config();
const { Canvas, resolveImage } = require('canvas-constructor');
const canvas = require('canvas');
const { registerFont } = require('canvas');
const e = require('express');

// Register the font for use in the canvas
registerFont("./LuckiestGuy-Regular.ttf", { family: 'Luckiest Guy' });

// Create an instance of the Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Event triggered once the bot is ready
client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const activities = [
        `Love has a cost, and both of us lost`,
        `Mostly sleepless🌛`,
        `Mewwme's Everywhere`,
    ];

    // Set interval to randomly change the bot's status
    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];

        client.user.setPresence({
            activities: [
                {
                    name: randomActivity,
                    type: 4,
                },
            ],
            status: "idle",
        });
    }, 5000);
});

// Function to generate an image (welcome or goodbye) for a membeR
const generateImage = async (member, channelId, isWelcome) => {
    try {
        // List of greetings and images for the welcome/goodbye images
        const greetings = isWelcome ? ["Hi,", "Hallo,", "Heyho,", "Hola,"] : ["Adiós,", "Bye,", "Sayōnara,"];
        const images = [
            "https://cdn.is-a.fun/mewcard/mewwme/1.png",
            "https://cdn.is-a.fun/mewcard/mewwme/2.png",
            "https://cdn.is-a.fun/mewcard/mewwme/3.png",
            "https://cdn.is-a.fun/mewcard/mewwme/4.png",
            "https://cdn.is-a.fun/mewcard/mewwme/5.png",
            "https://cdn.is-a.fun/mewcard/mewwme/6.png",
            "https://cdn.is-a.fun/mewcard/mewwme/7.png",
            "https://cdn.is-a.fun/mewcard/mewwme/8.png",
            "https://cdn.is-a.fun/mewcard/mewwme/9.png",
            "https://cdn.is-a.fun/mewcard/mewwme/10.png",
            "https://cdn.is-a.fun/mewcard/mewwme/11.png",
            "https://cdn.is-a.fun/mewcard/mewwme/12.png",
            "https://cdn.is-a.fun/mewcard/mewwme/13.png",
            "https://cdn.is-a.fun/mewcard/mewwme/14.png",
            "https://cdn.is-a.fun/mewcard/mewwme/15.png",
            "https://cdn.is-a.fun/mewcard/mewwme/16.png",
            "https://cdn.is-a.fun/mewcard/mewwme/17.png",
            "https://cdn.is-a.fun/mewcard/mewwme/18.png",
            "https://cdn.is-a.fun/mewcard/mewwme/19.png",
            "https://cdn.is-a.fun/mewcard/mewwme/20.png",
            "https://cdn.is-a.fun/mewcard/mewwme/21.png",
            "https://cdn.is-a.fun/mewcard/mewwme/22.png",
            "https://cdn.is-a.fun/mewcard/mewwme/23.png",
            "https://cdn.is-a.fun/mewcard/mewwme/24.png",
            "https://cdn.is-a.fun/mewcard/mewwme/25.png",
            "https://cdn.is-a.fun/mewcard/mewwme/26.png",
            "https://cdn.is-a.fun/mewcard/mewwme/27.png",
            "https://cdn.is-a.fun/mewcard/mewwme/28.png",
            "https://cdn.is-a.fun/mewcard/mewwme/29.png",
            "https://cdn.is-a.fun/mewcard/mewwme/30.png",
            "https://cdn.is-a.fun/mewcard/mewwme/31.png",
            "https://cdn.is-a.fun/mewcard/mewwme/32.png",
            "https://cdn.is-a.fun/mewcard/mewwme/33.png",
            "https://cdn.is-a.fun/mewcard/mewwme/34.png",
            "https://cdn.is-a.fun/mewcard/themes7/35.png",];

        const textColors = ['#f4e0c5', '#ff9200', '#9893fc', '#ff00ea', '#00ff18'];
        // Randomly select greeting, image, and text color
        const randomColor = textColors[Math.floor(Math.random() * textColors.length)];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        const randomImageIndex = Math.floor(Math.random() * images.length);
        const selectedImage = images[randomImageIndex];

        // Load images and resolve user's display avatar
        const img = await canvas.loadImage(selectedImage);
        const userPfp = await resolveImage(member.user.displayAvatarURL({
            extension: 'jpg',
            size: 1024,
        }));
        const greetingText = `${randomGreeting}`;
        const namee = member.user.username.length > 11
            ? member.user.username.substring(0, 11) + '...'
            : member.user.username;

        // Create a canvas and construct the welcome/goodbye image
        return new Canvas(994, 198)
            .printImage(img, 0, 0, 994, 198)
            .setColor(randomColor)
            .setTextFont('32px Luckiest Guy')
            .printWrappedText(greetingText, 252, 85)
            .setTextFont('54px Luckiest Guy')
            .printWrappedText(namee, 252, 140)
            .printCircularImage(userPfp, 146, 100, 67, 67)
            .toBuffer();
    } catch (error) {
        console.error('Error generating image:', error);
        throw error; // Escalate the error to other handling if needed
    }
};

// Event triggered when a new member joins the server
client.on('guildMemberAdd', async (member) => {
    try {
        console.log(`Member joined: ${member.user.tag}`);
        const channelId = process.env.WELCOME_CHANNEL_ID;

        if (!channelId) {
            return;
        }

        const image = await generateImage(member, channelId, true); // SET TRUE FOR WELCOME GREETINGS
        const attachment = new AttachmentBuilder(image, {
            name: "mewwme.png",
        });   

        const channel = await client.channels.fetch(channelId);

        const WelcomeEmbed = new EmbedBuilder()
            .setImage("attachment://mewwme.png")
            .setColor("#f2d7b7")

        const ButtonLink = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Mewwme's")
                    .setEmoji("<:singing:1196006929932234782>")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://meww.me")
            );

        channel.send({
            content: `Welcome to ${member.guild.name} <@${member.id}>, Stay in your imagination!`,
            embeds: [WelcomeEmbed],
            files: [attachment],
            components: [ButtonLink],
        }).catch(error => {
            console.error('Error sending welcome message:', error);
        });
    } catch (error) {
        console.error('Error handling guild member add event:', error);
    }
});

// Event triggered when a member leaves the server
client.on('guildMemberRemove', async (member) => {
    try {
        console.log(`Member left: ${member.user.tag}`);
        const channelId = process.env.LEAVE_CHANNEL_ID;

        if (!channelId) {
            return;
        }

        const image = await generateImage(member, channelId, false); // SET FALSE FOR GOODBYE GREETINGS
        const attachment = new AttachmentBuilder(image, {
            name: "mewwme.png",
        });
        const channel = await client.channels.fetch(channelId);

        const LeaveEmbed = new EmbedBuilder()
            .setImage("attachment://mewwme.png")
            .setColor("#f2d7b7")

        channel.send({
            content: `Thanks for being with us <@${member.user.id}>`,
            embeds: [LeaveEmbed],
            files: [attachment],
        }).catch(error => {
            console.error('Error sending goodbye message:', error);
        });
    } catch (error) {
        console.error('Error handling guild member remove event:', error);
    }
});

client.on('error', (error) => {
    console.error('Client error:', error);
});

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);