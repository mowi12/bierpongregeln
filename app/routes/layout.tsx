import Footer from "@/components/footer";
import type { Route } from "./+types/home";
import { Outlet } from "react-router";
import Header from "@/components/header";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Bierpongregeln" }];
}

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen">
      <Header />

      <main className="flex-grow flex flex-col justify-start w-full">
        <Outlet />
      </main>

      <Footer authors={["Felix Schlegel", "Moritz Wieland"]}></Footer>
    </div>
  );
}
