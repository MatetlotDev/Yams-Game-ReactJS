export default function(token = '', action){
    console.log(action.token)
    if(action.type == 'adduser'){
        return action.token;
    }

    else return token;
}