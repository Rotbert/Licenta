import Filter from "bad-words";

const ChatFilter = (chatMessage) => {
  if (chatMessage !== undefined) {
    const filter = new Filter();

    filter.addWords("suck", "u suck", "you suck");

    return filter.clean(chatMessage);
  }

  return chatMessage;
};

export default ChatFilter;
