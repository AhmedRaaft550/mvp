export interface MealItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
}

export const MOCK_MEALS: MealItem[] = [
  // --- BURGERS ---
  {
    id: "b1",
    name: "Signature Smoked Burger",
    description:
      "Premium beef patty, sharp cheddar cheese, smoked beef bacon, and our secret BBQ house sauce in a toasted brioche bun.",
    price: 12.99,
    category: "burgers",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    id: "b2",
    name: "Truffle Mushroom Burger",
    description:
      "Sautéed Swiss brown mushrooms, melted provolone cheese, and a rich, aromatic white truffle mayo drizzle.",
    price: 14.5,
    category: "burgers",
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },

  // --- PIZZA ---
  {
    id: "p1",
    name: "Classic Pepperoni",
    description:
      "Artisanal sourdough crust, rich Italian tomato sauce, premium mozzarella, and lots of crispy, cured beef pepperoni.",
    price: 15.99,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    id: "p2",
    name: "Truffle Mushroom Pizza",
    description:
      "White base pizza with mozzarella, wild mushrooms, fresh rosemary, and an exquisite black truffle oil finish.",
    price: 17.5,
    category: "pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },

  // --- DRINKS ---
  {
    id: "d1",
    name: "Iced Spanish Latte",
    description:
      "Double shot of premium espresso blended with chilled condensed milk and fresh organic whole milk over ice.",
    price: 5.5,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    id: "d2",
    name: "Fresh Passionfruit Mojito",
    description:
      "A refreshing mocktail of crushed mint leaves, fresh lime slices, pure passionfruit puree, topped with sparkling water.",
    price: 6.0,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },

  // --- DESSERTS ---
  {
    id: "e1",
    name: "San Sebastian Cheesecake",
    description:
      "Crustless, creamy burnt Basque cheesecake with a rich, molten center, served with a warm Belgian milk chocolate pour.",
    price: 8.5,
    category: "desserts",
    isAvailable: true,
  },

  // --- OTHERS (Sides / Add-ons) ---
  {
    id: "o1",
    name: "Truffle Parmesan Fries",
    description:
      "Thick-cut golden dynamic fries tossed in white truffle oil, grated aged parmesan cheese, and fresh chopped parsley.",
    price: 4.99,
    category: "others",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    id: "o2",
    name: "Extra Dynamite Sauce",
    description:
      "Our signature house dip—creamy, slightly spicy, and infused with smoky spices. Perfect for dipping fries or burgers.",
    price: 1.25,
    category: "others",

    isAvailable: true,
  },
];
