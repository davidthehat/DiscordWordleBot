//admin send command
//not a discord slash command, entered through the console

function usage() {
    console.log("Usage: (send <channel id> <message>)");
}


module.exports = {
    data: 
    {
        name: 'send',
    },
    async execute(line, args, client) {
        //check if args has at least 2 elements
        if (args.length < 2) {
            usage();
            return;
        }
        //channel id is the first argument. send the rest of the arguments as a message
        const channel = args[0];
        const message = args.slice(1).join(" ");
        try {
            //get the channel obj from the id
            const channelObj = await client.channels.fetch(channel);
            //send the message
            await channelObj.send(message);
        }
        catch (error) {
            console.log(error);
        }
       

    }
};