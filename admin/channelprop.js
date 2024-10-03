//admin send command
//not a discord slash command, entered through the console

function usage() {
    console.log("Usage: (channel <channel id> [property])");
}


module.exports = {
    data: 
    {
        name: 'channelprop',
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
        if (args.length >= 2) {
            const property = args[1];
        }
        const property = args[1];
        try {
            //get the channel obj from the id
            const channelObj = await client.channels.fetch(channel);
            //send the name in console
            if (property != undefined) {
                console.log(channelObj[property]);
            } else {
                console.log(channelObj);
            
            }
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