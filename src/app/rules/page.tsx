import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <header className="relative mb-12">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Beer Pong Rules
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive collection of Beer Pong rulesets and tournament
              formats.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                We&apos;re working on organizing and presenting the rules in an
                easy-to-navigate format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This page will contain a comprehensive collection of Beer Pong
                rules and tournament formats. We&apos;re working on organizing
                and presenting the rules in an easy-to-navigate format.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
