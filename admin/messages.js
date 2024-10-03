//admin send command
//not a discord slash command, entered through the console

function usage() {
    console.log("Usage: (messages <channel id>)");
}


module.exports = {
    data: 
    {
        name: 'messages',
    },
    async execute(line, args, client) {
        //check if args has at least 1 elements
        if (args.length < 1) {
            usage();
            return;
        }
        //channel id is the first argument.
        //property is the second argument
        const channel = args[0];
      
        try {
            //get the channel obj from the id
            const channelObj = await client.channels.fetch(channel);
            //get messages from channel
            const messages = await channelObj.messages.fetch();
            console.log(messages);
        }
        catch (error) {
            if (error.code == 50001) {
                console.log("Missing access")
            } else {
                console.log(error);
            }
        }
       

    }
};