import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function TournamentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Tournament Results"
          description="Browse past tournament results, statistics, and historical data."
        />

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
