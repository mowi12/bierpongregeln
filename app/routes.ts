import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("regelwerk", "routes/regelwerk.tsx"),
    route("ergebnisse", "routes/ergebnisse.tsx"),
    route("turniermodus-generator", "routes/turniermodus-generator.tsx"),
    route("flavors/:flavorname", "routes/flavors.tsx"),
    route("cups/:cupName", "routes/cups.tsx"),
  ]),
] satisfies RouteConfig;
