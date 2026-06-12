"use client";

import FloatButtons from "./FloatButton";
import ChatBox from "./ChatBox";
import { setChatBotBoxOpen } from "@/redux/slice";
import { ProChatProvider } from "@ant-design/pro-chat";
import useRedux from "@/hooks/useRedux";

const ChatBot = () => {
  const { state, dispatch } = useRedux();

  const chatbotStatus = state.chatbot.chatbotBoxOpen;

  const handleOpenAi = () => {
    dispatch(setChatBotBoxOpen(true));
  };

  return (
    <div className="relative">
      <FloatButtons openAi={chatbotStatus} handleOpenAi={handleOpenAi} />
      <ProChatProvider>
        <ChatBox openAi={chatbotStatus} />
      </ProChatProvider>
    </div>
  );
};

export default ChatBot;
