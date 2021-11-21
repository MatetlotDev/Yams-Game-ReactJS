export default function(gamename = '', action){
    console.log(action.game)
    if(action.type === 'selectgame'){
        return action.game;
    }

    else return gamename;
}