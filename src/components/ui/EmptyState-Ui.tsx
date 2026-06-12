"use client";

import { Empty, Button } from "antd";
import Link from "next/link";

type EmptyStateType =
  | "cart"
  | "orders"
  | "menu"
  | "adminOrders"
  | "adminNotifications"
  | "error";

interface EmptySatetProps {
  type: EmptyStateType;
  query?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

const stateConfig: Record<
  EmptyStateType,
  {
    title: string;
    description: string;
    actionText?: string;
    actionHref?: string;
  }
> = {
  cart: {
    title: "Your cart is empty",
    description: "Add items from the menu to start your order.",
    actionText: "Browse menu",
    actionHref: "/menu",
  },
  orders: {
    title: "No orders yet",
    description:
      "You will see your live order tracking here once you place an order.",
    actionText: "Browse menu",
    actionHref: "/menu",
  },
  menu: {
    title: "No meals found",
    description: "Try adjusting your search or category to find a dish.",
    actionText: "View full menu",
    actionHref: "/menu",
  },
  adminOrders: {
    title: "No orders available",
    description:
      "There are no current orders to display. Refresh if you expect live updates.",
    actionText: "Refresh orders",
  },
  adminNotifications: {
    title: "No notifications yet",
    description:
      "Customer calls will appear here when they request assistance.",
    actionText: "Refresh notifications",
  },
  error: {
    title: "Unable to load this section",
    description:
      "Something went wrong. Please refresh the page or try again later.",
    actionText: "Go home",
    actionHref: "/",
  },
};

const EmptySatet = ({
  type,
  query,
  description,
  actionText,
  actionHref,
  actionOnClick,
}: EmptySatetProps) => {
  const config = stateConfig[type];
  const hasQuery = Boolean(query && query.trim().length > 0);
  const descriptionText =
    description ||
    (type === "menu" && hasQuery
      ? `No results found for "${query}".`
      : config.description);

  return (
    <div className="text-center min-h-[320px] flex flex-col items-center justify-center px-6 py-10">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="max-w-sm mx-auto">
            <h3 className="text-base font-semibold text-slate-200 mb-2">
              {config.title}
            </h3>
            <p className="text-sm text-slate-400 mb-6">{descriptionText}</p>
            {(actionHref || actionOnClick) &&
              (actionHref ? (
                <Link href={actionHref} passHref>
                  <Button type="primary" size="large">
                    {actionText || config.actionText}
                  </Button>
                </Link>
              ) : (
                <Button type="primary" size="large" onClick={actionOnClick}>
                  {actionText || config.actionText}
                </Button>
              ))}
          </div>
        }
      />
    </div>
  );
};

export default EmptySatet;
