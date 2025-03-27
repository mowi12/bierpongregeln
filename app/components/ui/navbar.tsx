import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export enum NavbarVariant {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

interface NavbarProps {
  variant: NavbarVariant;
  className?: string;
}

function Navbar(props: NavbarProps) {
  let flag = false;
  if (props.variant == NavbarVariant.VERTICAL) {
    flag = true;
  }

  return (
    <nav className={cn(props.className)}>
      <NavigationMenu viewport={false}>
        <NavigationMenuList className={flag ? "flex flex-col" : ""}>
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
    </nav>
  );
}

export default Navbar;
