"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { ParticipationPoint } from "@/lib/tournament-stats";

const config = {
    returning: { label: "Schon dabei gewesen", color: "var(--chart-1)" },
    newcomers: { label: "Neu dabei", color: "var(--chart-2)" },
} satisfies ChartConfig;

/**
 * Stacked columns of the participants per tournament, split into returning players and newcomers.
 */
export function ParticipationChart({ data }: { data: ParticipationPoint[] }) {
    const dateById = new Map(data.map((point) => [point.id, point.date]));
    const labelById = new Map(data.map((point) => [point.id, point.label]));

    return (
        <div className="bg-card rounded-xl border px-2 pt-5 pb-3 lg:rounded-3xl lg:px-5 lg:pt-7">
            <ChartContainer config={config} className="aspect-auto h-64 w-full lg:h-72">
                <BarChart data={data} accessibilityLayer margin={{ left: -16, right: 8 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="id"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={8}
                        tickFormatter={(id: string) => labelById.get(id) ?? ""}
                    />
                    <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={40} />
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelFormatter={(_, payload) =>
                                    dateById.get(payload?.[0]?.payload?.id) ?? ""
                                }
                            />
                        }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                        dataKey="returning"
                        stackId="participants"
                        fill="var(--color-returning)"
                        maxBarSize={24}
                        stroke="var(--card)"
                        strokeWidth={2}
                    />
                    <Bar
                        dataKey="newcomers"
                        stackId="participants"
                        fill="var(--color-newcomers)"
                        maxBarSize={24}
                        radius={[4, 4, 0, 0]}
                        stroke="var(--card)"
                        strokeWidth={2}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
}
