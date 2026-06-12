import Link from "next/link";

const MenuNavigation = ({ text }: { text: string }) => {
  return (
    <Link
      href="/menu"
      className="bg-[#7a6011]! w-full! block! text-sm py-2 px-3 rounded-full text-black! font-semibold active:scale-105! transition-transform my-2"
    >
      {text}
    </Link>
  );
};

export default MenuNavigation;
