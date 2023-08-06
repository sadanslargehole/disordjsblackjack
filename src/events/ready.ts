import { trace } from 'console';
import { myClient } from 'src/main';

module.exports = async (client: myClient)=>{
    
    try {
        client.user?.setStatus('dnd');
        client.user?.setActivity('work?');
        console.log('asd');
        (await (await client.users.fetch('521819891141967883')).createDM()).send('what came before, therefore chiptune is more believable indeed').then(()=>{
            console.log('up');
        });
    } catch (error) {
        trace(error);
    }
};