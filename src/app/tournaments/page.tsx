import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TournamentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <header className="relative mb-12">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Tournament Results
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse past tournament results, statistics, and historical data.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                We&apos;re working on building a comprehensive database of past
                tournaments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This page will display tournament results, statistics, and
                historical data. We&apos;re working on building a comprehensive
                database of past tournaments.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
