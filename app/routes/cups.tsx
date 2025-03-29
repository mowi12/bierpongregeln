import type { Route } from "./+types/cups";

import GreinerCup3 from "@/assets/md-docs/cups/greiner-cup-3.mdx";

const flavors = [{ name: "greiner-cup-3", Component: GreinerCup3 }];

async function Flavors({ params }: Route.ComponentProps) {
  const mdxContent = flavors.find(
    (flavor) => flavor.name === params.flavorname,
  );
  let MDXContent = null;
  if (mdxContent?.Component) {
    MDXContent = mdxContent.Component;
  }

  return <MDXContent />;
}

export default Flavors;
