import { Link } from "react-router";
import logo from "@/assets/logo-full.svg";
import { ModeToggle } from "./mode-toggle";
import BurgerMenu from "./burgerMenu";
import { cn } from "@/lib/utils";
import Navbar, { NavbarVariant } from "./navbar";

interface HeaderProps {
  className?: string;
}

function Header(props: HeaderProps) {
  return (
    <header
      className={cn(
        "w-full p-5 flex flex-row justify-between",
        props.className,
      )}
    >
      <Link to="/" className="h-full flex items-center">
        <img src={logo} alt="Logo" className="min-w-9 aspect-square" />
      </Link>

      <Navbar variant={NavbarVariant.HORIZONTAL} className="hidden md:flex" />

      <ModeToggle className="hidden md:flex" />

      <BurgerMenu />
    </header>
  );
}

export default Header;
