import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function Home() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-10">
      <img
        src="/logo/logo-full.svg"
        alt="Logo"
        className="w-3/5 md:w-2/7 md:max-w-110"
      />

      <div className="flex flex-col items-center gap-5">
        <h1 className="text-4xl md:text-6xl font-bold">Bierpongregeln</h1>
        <h3 className="text-xl md:text-2xl">
          Die beste Bierpongregelsammlung!
        </h3>
        <Button className="h-10 w-30 text-1xl">
          <Link to="regelwerk">Regelwerk</Link>
        </Button>
      </div>
    </div>
  );
}

export default Home;
