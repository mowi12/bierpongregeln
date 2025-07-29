import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="relative mb-12">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.svg"
                alt="Bierpongregeln Logo"
                width={300}
                height={100}
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Bierpongregeln
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The definitive resource for Beer Pong rules, tournament results,
              and live tournament management.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="group hover:shadow-lg transition-all duration-200 flex flex-col">
              <CardHeader>
                <CardTitle className="group-hover:text-primary">
                  Rules & Documentation
                </CardTitle>
                <CardDescription>
                  Browse comprehensive Beer Pong rulesets and tournament
                  formats.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <Link href="/rules">View Rules</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-200 flex flex-col">
              <CardHeader>
                <CardTitle className="group-hover:text-primary">
                  Tournament Results
                </CardTitle>
                <CardDescription>
                  View past tournament results and statistics.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <Link href="/tournaments">View Results</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Tournament Generator
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Interactive tools to help organizers plan tournaments.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Live Tournaments
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Real-time tournament management and live updates.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Multi-language
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Support for multiple languages and international rules.
                  </p>
                </div>
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
