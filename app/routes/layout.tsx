import Footer from "@/components/footer";
import type { Route } from "./+types/home";
import { Outlet } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Bierpongregeln" }];
}

export default function Home() {
  return (
    <div className="bg-secondary text-primary flex flex-col items-center h-screen">
      <main className="flex-grow flex flex-col justify-center w-full h-full">
        <Outlet />
      </main>

      <Footer authors={["Felix Schlegel", "Moritz Wieland"]}></Footer>
    </div>
  );
}
