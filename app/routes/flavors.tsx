import { Outlet } from "react-router";
import type { Route } from "./+types/flavors";

export async function loader({ params }: Route.LoaderArgs) {}

function Flavors({ params }: Route.ComponentProps) {
  return <Outlet />;
}

export default Flavors;
