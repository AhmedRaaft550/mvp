import { toast } from "sonner";

export const confirmActionWithToast = (
  confirmClick: () => void,
  title = "Orders will be permanently deleted, want to proceed?",
) => {
  toast(title, {
    duration: Infinity,
    actionButtonStyle: {
      backgroundColor: "#82181a",
      color: "#fff",
      fontWeight: "bold",
      padding: "16px",
    },
    cancelButtonStyle: {
      backgroundColor: "#000",
      color: "#fff",
      fontWeight: "bold",
      padding: "16px",
    },

    action: {
      label: "Confirm",

      onClick: () => {
        confirmClick();
      },
    },
    cancel: {
      label: "Cancel",
      onClick: () => toast.dismiss(),
    },
  });
};
