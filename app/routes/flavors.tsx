import type { Route } from "./+types/flavors";

import Moritz from "@/assets/md-docs/flavors/moritz.mdx";
import Felix from "@/assets/md-docs/flavors/felix.mdx";
import Marcel from "@/assets/md-docs/flavors/marcel.mdx";
import Sniper from "@/assets/md-docs/flavors/sniper.mdx";
import MoreBalls from "@/assets/md-docs/flavors/mehr_baelle.mdx";
import GamePigeon from "@/assets/md-docs/flavors/game_pigeon.mdx";
import DoubleTable from "@/assets/md-docs/flavors/double_table.mdx";
import ThreeD from "@/assets/md-docs/flavors/3d.mdx";

const flavors = [
  { name: "moritz", Component: Moritz },
  { name: "felix", Component: Felix },
  { name: "marcel", Component: Marcel },
  { name: "sniper", Component: Sniper },
  { name: "mehr_baelle", Component: MoreBalls },
  { name: "game_pigeon", Component: GamePigeon },
  { name: "double_table", Component: DoubleTable },
  { name: "3d", Component: ThreeD },
];

async function Flavors({ params }: Route.ComponentProps) {
  const mdxContent = flavors.find(
    (flavor) => flavor.name === params.flavorname,
  );
  let MDXContent = null;
  if (mdxContent?.Component) {
    MDXContent = mdxContent.Component;
  }

  return (
    <div className="mdx">
      <MDXContent />
    </div>
  );
}

export default Flavors;
