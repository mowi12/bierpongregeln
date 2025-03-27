import { useState } from "react";
import { Menu as BurgerMenuIcon, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import Navbar, { NavbarVariant } from "./navbar";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <BurgerMenuIcon
        className="stroke-secondary-foreground size-9 z-20"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Sliding Background */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-secondary text-secondary-foreground z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="m-5 flex flex-row justify-between">
          <ModeToggle className="z-50" />

          <X
            className="stroke-secondary-foreground size-9 z-50"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        <Navbar
          variant={NavbarVariant.VERTICAL}
          className="w-full mt-20 flex justify-center"
        />
      </div>

      {/* Overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-70 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
