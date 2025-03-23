import { Outlet } from "react-router";
import type { Route } from "./+types/flavors";

export async function loader({ params }: Route.LoaderArgs) {}

function Cups({ params }: Route.ComponentProps) {
  return <Outlet />;
}

export default Cups;
