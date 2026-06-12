import { ProChat, useProChat } from "@ant-design/pro-chat";
import { IoMdClose } from "react-icons/io";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { toast } from "sonner";
import { setChatBotBoxOpen } from "@/redux/slice";
import { useEffect } from "react";
import { setChatQuery } from "@/redux/slice";
import useRedux from "@/hooks/useRedux";
import { addToCart } from "@/redux/slice";
import { MOCK_MEALS } from "@/const/menu-static-data";

const USER_MOCK = false;

interface ChatBoxProps {
  openAi: boolean;
}

const ChatBox = ({ openAi }: ChatBoxProps) => {
  const { state, dispatch } = useRedux();
  // const [botAnswer, setBotAnswer] = useState("");

  const chatQuery = state.chatbot.chatQuery;
  const chatProInstance = useProChat();

  useEffect(() => {
    console.log(chatProInstance);
  }, [chatProInstance]);

  // handle sending the user query to the bot from the item card
  useEffect(() => {
    if (openAi && chatQuery && chatProInstance) {
      const timer = setTimeout(() => {
        chatProInstance.sendMessage(chatQuery);
        dispatch(setChatQuery(""));
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [openAi, chatQuery, chatProInstance, dispatch]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          openAi
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => dispatch(setChatBotBoxOpen(false))}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-110 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out transform ${
          openAi ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 mainBg text-white shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-semibold text-sm leading-tight">
                Virtual Waiter
              </h3>
              <p className="text-xs text-amber-100">
                Ready to assist you with your order
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              dispatch(setChatBotBoxOpen(false));
              dispatch(setChatQuery(""));
              chatProInstance.clearMessage();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors duration-150"
            aria-label="Close chat"
          >
            <IoMdClose size={22} />
          </button>
        </div>

        {/* chat box */}
        <div className="flex-1 overflow-hidden bg-stone-50">
          <ProChat
            inputAreaProps={{
              autoFocus: true,

              placeholder: "Ask for recommendations, allergy info...",
              disabled: true,
              onKeyDown: (e) => {
                const target = e.target as HTMLTextAreaElement;
                if (e.key === "Enter" && !e.shiftKey) {
                  if (!target.value.trim()) {
                    e.preventDefault();
                    toast.error("Please type something");
                  }
                }
              },
            }}
            chatItemRenderConfig={{
              contentRender: (props, defaultDom) => {
                const isAssistant = props?.originData?.role === "assistant";
                const item = props?.originData?.content as string; // bot answer
                const itemName = item?.match(/\*\*(.*?)\*\*/)?.[1];
                const isDone = !props.loading;

                if (!itemName) return defaultDom;

                const targetedMeal = MOCK_MEALS.find((meal) =>
                  meal?.name.toLowerCase().includes(itemName.toLowerCase()),
                );

                if (!targetedMeal) {
                  return defaultDom;
                }

                const handleAddToCart = () => {
                  const isExisting = state.cart.cartItems.some(
                    (item) => item.id === targetedMeal.id,
                  );
                  console.log(isExisting);
                  console.log(state.cart.cartItems.length);

                  if (!isExisting) {
                    dispatch(addToCart(targetedMeal));
                    toast.success(`${targetedMeal.name} added to cart!`, {
                      id: "cart-toast",
                    });

                    chatProInstance.pushChat({
                      role: "assistant",
                      content: `Done! 🛒 I have added ${targetedMeal.name} to your cart. Would you like to add anything else, or are you ready to review your order?`,
                    });
                  } else {
                    toast.error("Already in your cart", { id: "cart-toast" });
                  }
                };

                if (!isAssistant || !isDone || !targetedMeal) {
                  return defaultDom;
                }

                return (
                  <div>
                    {defaultDom}
                    {isAssistant && isDone && targetedMeal && (
                      <div className="mt-2 flex justify-start">
                        <button
                          onClick={handleAddToCart}
                          className="flex items-center gap-1.5 px-3 py-2 bg-[#d4af37] text-white! text-xs font-semibold rounded-lg shadow-[#d4af37] shadow-sm transition-all active:scale-95 cursor-pointer mt-1"
                        >
                          <MdOutlineAddShoppingCart size={14} />
                          Order Now
                        </button>
                      </div>
                    )}
                  </div>
                );
              },
            }}
            className="h-full"
            helloMessage="Hello! I'm your virtual waiter today. You can ask me about our special dishes, ingredients, or even place an order. How can I help you?!"
            assistantMeta={{
              avatar: "🤖",
              name: "AI",
              title: "Virtual Waiter",
            }}
            userMeta={{
              avatar: "👤",
              name: "user",
              title: "You",
            }}
            backToBottomConfig={{
              alwaysShow: false,
              text: "↓",
            }}
            // Hidden because our custom premium panel replaces it beautifully
            showTitle={false}
            request={async (messages) => {
              const lastMessage = messages[messages.length - 1];

              if (USER_MOCK) {
                // Simulating a tiny typing delay for realism
                await new Promise((resolve) => setTimeout(resolve, 600));
                return new Response(
                  `I would love to help you with: "${lastMessage.content}". This item is highly recommended by our chef!`,
                );
              }

              try {
                const response = await fetch(
                  "/api/chat",

                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      message: lastMessage.content,
                    }),
                  },
                );

                if (!response.ok) throw new Error("Network error");
                const data = await response.json();
                return new Response(data.reply);
              } catch (error) {
                console.log(error);
                toast.error("Failed to connect to the kitchen server.");
                return new Response(
                  "Sorry, I'm having trouble connecting right now. Please try again or ask waiter to help.",
                );
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ChatBox;
