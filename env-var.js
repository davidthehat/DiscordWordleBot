// Get arguments from command input to determine environment state
const args = process.argv.slice(2);
const env_state = args[0];

const allowed_env_states = ['dev', 'prod'];

const getConfig = () => {
    if (!allowed_env_states.includes(env_state)) {
        throw new Error(`Invalid environment state: ${env_state}. Must be one of: ${allowed_env_states}.`);
    }
    require('dotenv').config({ path: './.env'+env_state });
    
    const env_client_id = process.env.CLIENT_ID;
    const env_guild_id = process.env.GUILD_ID;
    const env_token = process.env.TOKEN;

    const configJson = JSON.parse('{"clientId": "' + env_client_id + '", "guildId": "' + env_guild_id + '", "token": "' + env_token + '"}');
    return configJson;
}

exports.getConfig = getConfig;