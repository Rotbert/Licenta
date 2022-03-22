import Filter from 'bad-words';

const ChatFilter = (chatMessage) => {

    if(chatMessage !== undefined){
        const filter = new Filter();
    
        filter.addWords('suck', 'u suck', 'you suck', 'bad1');
    
        return filter.clean(chatMessage);
    }

    return chatMessage;

}

export default ChatFilter;