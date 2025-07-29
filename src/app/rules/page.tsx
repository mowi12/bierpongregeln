import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Beer Pong Rules"
          description="Comprehensive collection of Beer Pong rulesets and tournament formats."
        />

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
