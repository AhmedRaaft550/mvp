import { BsRobot } from "react-icons/bs";
import { IoIosHelpCircle } from "react-icons/io";
import { PiCallBellFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { FloatButton } from "antd";
import insertUserNotification from "@/actions/user-notifications";
import { toast } from "sonner";

type Props = {
  openAi: boolean;
  handleOpenAi: () => void;
};

const FloatButtons: React.FC<Props> = ({ handleOpenAi, openAi }) => {
  const [open, setOpen] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const INITIAL_COUNTDOWN = 60;

  useEffect(() => {
    if (countDown === 0) return;
    const interval = setInterval(() => {
      if (countDown > 0) {
        setCountDown((prev) => prev - 1);
      }
    }, 1000);
    // clean up
    return () => clearInterval(interval);
  }, [countDown]);

  const handleSendingNotifications = async () => {
    if (countDown > 0) return;
    try {
      const result = await insertUserNotification({
        table_id: "1",
        customer_session_id: "1",
        type: "call_waiter",
      });

      if (result.success && result.data) {
        setCountDown(INITIAL_COUNTDOWN);
        toast.success("Your waiter is on their way!", {
          id: "call-waiter-toast",
          duration: Infinity,
          closeButton: true,
        });
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  };

  return (
    <div className="">
      {!openAi && (
        <FloatButton.Group
          trigger="click"
          open={open}
          onOpenChange={setOpen}
          style={{ insetInlineEnd: 24, bottom: 24 }}
          icon={<IoIosHelpCircle size={22} color="#d3a10c" />}
          shape="circle"
          className="[&>.ant-float-btn-group-trigger]:bg-amber-600 [&>.ant-float-btn-group-trigger]:hover:bg-amber-700 transition-colors duration-200 fixed! z-50 bottom-20! right-2! "
        >
          <FloatButton
            disabled={countDown > 0}
            icon={
              countDown > 0 ? (
                <span
                  className={`animate-pulse ${countDown < 30 ? "text-red-700" : "text-green-700"} font-semibold text-[10px]`}
                >
                  5 mins
                </span>
              ) : (
                <PiCallBellFill size={20} color="red" />
              )
            }
            tooltip={countDown > 0 ? "Waiter on the way" : "Ring Bell"}
            onClick={() => {
              setOpen(false);
              handleSendingNotifications();
            }}
            className="bg-white!"
          />

          {/* Note => this line has removed since the user will not be able to ask AI and will be updated in the next version of the system */}

          {/* <FloatButton
            icon={<BsRobot size={20} color="gray" />}
            tooltip="Ask AI"
            onClick={() => {
              handleOpenAi();
              setOpen(false);
            }}
          /> */}
        </FloatButton.Group>
      )}
    </div>
  );
};

export default FloatButtons;
