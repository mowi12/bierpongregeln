import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function Home() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-10">
      <img src="/logo/logo-full.svg" alt="Logo" className="w-2/7" />

      <div className="flex flex-col items-center gap-5">
        <h1 className="text-6xl font-bold">Bierpongregeln</h1>
        <h3 className="text-2xl">Die beste Bierpongregelsammlung!</h3>
        <Button className="h-12 w-35 text-1xl">
          <Link to="regelwerk">Regelwerk</Link>
        </Button>
      </div>
    </div>
  );
}

export default Home;
