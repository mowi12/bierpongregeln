import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { ActionCard } from "@/components/action-card";
import { FeatureCard } from "@/components/feature-card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Bierpongregeln"
          description="The definitive resource for Beer Pong rules, tournament results, and live tournament management."
          showLogo={true}
        />

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <ActionCard
              title="Rules & Documentation"
              description="Browse comprehensive Beer Pong rulesets and tournament formats."
              href="/rules"
              buttonText="View Rules"
            />
            <ActionCard
              title="Tournament Results"
              description="View past tournament results and statistics."
              href="/tournaments"
              buttonText="View Results"
            />
          </div>

          {/* Features Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard
                  icon={
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  }
                  title="Tournament Generator"
                  description="Interactive tools to help organizers plan tournaments."
                />
                <FeatureCard
                  icon={
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  }
                  title="Live Tournaments"
                  description="Real-time tournament management and live updates."
                />
                <FeatureCard
                  icon={
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  }
                  title="Multi-language"
                  description="Support for multiple languages and international rules."
                />
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 py-8 border-t border-border">
          <p className="text-muted-foreground">
            © 2024 Bierpongregeln. Open source under{" "}
            <a href="/LICENSE" className="text-primary hover:underline">
              GNU GPL v3.0
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
