import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

interface PageHeaderProps {
  title: string;
  description: string;
  showLogo?: boolean;
}

export function PageHeader({
  title,
  description,
  showLogo = false,
}: PageHeaderProps) {
  return (
    <header className="relative mb-12">
      <div className="absolute top-0 right-0">
        <ThemeToggle />
      </div>
      <div className="text-center">
        {showLogo && (
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="Bierpongregeln Logo"
              width={300}
              height={100}
              priority
            />
          </div>
        )}
        <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </header>
  );
}
