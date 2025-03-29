import Footer from "@/components/ui/footer";
import type { Route } from "./+types/home";
import { Outlet } from "react-router";
import Header from "@/components/ui/header";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Bierpongregeln" }];
}

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen bg-secondary text-secondary-foreground">
      <Header />

      <main className="flex-grow flex flex-col justify-start w-full p-5">
        <Outlet />
      </main>

      <Footer authors={["Felix Schlegel", "Moritz Wieland"]}></Footer>
    </div>
  );
}
