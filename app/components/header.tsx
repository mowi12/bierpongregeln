import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";
import logo from "@/assets/logo-full.svg";
import { ModeToggle } from "./mode-toggle";

function Header() {
  return (
    <header className="w-full p-5 flex flex-row justify-between">
      <Link to="/" className="h-full flex items-center">
        <img src={logo} alt="Logo" className="h-full w-auto" />
      </Link>

      <NavigationMenu className="z-1" viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="regelwerk">
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} bg-secondary text-secondary-foreground`}
              >
                Regelwerk
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-secondary text-secondary-foreground">
              Flavors
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <Link to="flavors/moritz">
                <NavigationMenuLink>Moritz</NavigationMenuLink>
              </Link>
              <Link to="flavors/felix">
                <NavigationMenuLink>Felix</NavigationMenuLink>
              </Link>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-secondary text-secondary-foreground">
              Ergebnisse & Cups
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <Link to="ergebnisse">
                <NavigationMenuLink>Ergebnisse</NavigationMenuLink>
              </Link>
              <Link to="cups/greiner-cup-3">
                <NavigationMenuLink>3. Greiner Cup</NavigationMenuLink>
              </Link>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="turniermodus-generator">
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} bg-secondary text-secondary-foreground`}
              >
                Turniermodus-Generator
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ModeToggle />
    </header>
  );
}

export default Header;
