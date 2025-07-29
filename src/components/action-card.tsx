import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

export function ActionCard({
  title,
  description,
  href,
  buttonText,
}: ActionCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 flex flex-col">
      <CardHeader>
        <CardTitle className="group-hover:text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button asChild className="w-full">
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
