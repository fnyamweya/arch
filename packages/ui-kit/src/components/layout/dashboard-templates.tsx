"use client";

import * as React from "react";
import Link from "next/link";
import {
    IconCheck,
    IconMinus,
    IconTrendingDown,
    IconTrendingUp,
} from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PageContainer } from "./page-container";

type TrendTone = "up" | "down" | "neutral";
type ItemTone = "positive" | "warning" | "neutral";

export interface DashboardTab {
    readonly label: string;
    readonly active?: boolean;
    readonly disabled?: boolean;
}

export interface DashboardMetric {
    readonly label: string;
    readonly value: string;
    readonly delta: string;
    readonly trend: TrendTone;
    readonly headline: string;
    readonly detail: string;
}

export interface DashboardBarSeries {
    readonly label: string;
    readonly total: string;
    readonly points: ReadonlyArray<number>;
}

export interface DashboardBarChartCard {
    readonly title: string;
    readonly description: string;
    readonly labels: ReadonlyArray<string>;
    readonly series: ReadonlyArray<DashboardBarSeries>;
}

export interface DashboardAreaSeries {
    readonly label: string;
    readonly points: ReadonlyArray<number>;
}

export interface DashboardAreaChartCard {
    readonly title: string;
    readonly description: string;
    readonly labels: ReadonlyArray<string>;
    readonly series: ReadonlyArray<DashboardAreaSeries>;
    readonly footerTitle: string;
    readonly footerNote: string;
}

export interface DashboardDonutSlice {
    readonly label: string;
    readonly value: number;
}

export interface DashboardDonutChartCard {
    readonly title: string;
    readonly description: string;
    readonly totalLabel: string;
    readonly slices: ReadonlyArray<DashboardDonutSlice>;
    readonly footerTitle: string;
    readonly footerNote: string;
}

export interface DashboardActivityItem {
    readonly title: string;
    readonly subtitle: string;
    readonly value: string;
    readonly initials: string;
}

export interface DashboardActivityCard {
    readonly title: string;
    readonly description: string;
    readonly items: ReadonlyArray<DashboardActivityItem>;
}

export interface DashboardStatusItem {
    readonly label: string;
    readonly value: string;
    readonly hint: string;
    readonly tone?: ItemTone;
}

export interface DashboardInsightCard {
    readonly title: string;
    readonly description: string;
    readonly items: ReadonlyArray<DashboardStatusItem>;
}

export interface DashboardTableRow {
    readonly primary: string;
    readonly meta: string;
    readonly secondary: string;
    readonly tertiary: string;
    readonly status: string;
    readonly tone?: ItemTone;
}

export interface DashboardTableCard {
    readonly title: string;
    readonly description: string;
    readonly columns: readonly [string, string, string, string];
    readonly rows: ReadonlyArray<DashboardTableRow>;
    readonly footer?: string;
}

export interface DashboardFormField {
    readonly label: string;
    readonly placeholder?: string;
    readonly helper?: string;
    readonly type?: "text" | "email" | "url" | "number";
    readonly kind?: "input" | "textarea";
}

export interface DashboardFormSection {
    readonly title: string;
    readonly description: string;
    readonly fields: ReadonlyArray<DashboardFormField>;
}

export interface DashboardFormCard {
    readonly title: string;
    readonly description: string;
    readonly sections: ReadonlyArray<DashboardFormSection>;
    readonly submitLabel: string;
}

export interface DashboardOverviewTemplateProps {
    readonly greeting: string;
    readonly actionLabel?: string;
    readonly actionHref?: string;
    readonly tabs?: ReadonlyArray<DashboardTab>;
    readonly metrics: ReadonlyArray<DashboardMetric>;
    readonly barChart: DashboardBarChartCard;
    readonly areaChart: DashboardAreaChartCard;
    readonly donutChart: DashboardDonutChartCard;
    readonly activity: DashboardActivityCard;
}

export interface DashboardTablePageTemplateProps {
    readonly pageTitle: string;
    readonly pageDescription: string;
    readonly actionLabel?: string;
    readonly actionHref?: string;
    readonly tabs?: ReadonlyArray<DashboardTab>;
    readonly metrics: ReadonlyArray<DashboardMetric>;
    readonly table: DashboardTableCard;
    readonly insights: DashboardInsightCard;
    readonly barChart?: DashboardBarChartCard;
    readonly donutChart?: DashboardDonutChartCard;
}

export interface DashboardFormPageTemplateProps {
    readonly pageTitle: string;
    readonly pageDescription: string;
    readonly actionLabel?: string;
    readonly actionHref?: string;
    readonly tabs?: ReadonlyArray<DashboardTab>;
    readonly metrics: ReadonlyArray<DashboardMetric>;
    readonly form: DashboardFormCard;
    readonly notes: DashboardInsightCard;
    readonly checklist?: DashboardInsightCard;
}

const donutColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
];

function TemplateAction({
    actionLabel,
    actionHref,
}: {
    readonly actionLabel?: string;
    readonly actionHref?: string;
}) {
    if (!actionLabel) {
        return null;
    }

    if (!actionHref) {
        return <Button type="button">{actionLabel}</Button>;
    }

    return (
        <Button type="button" asChild>
            <Link href={actionHref}>{actionLabel}</Link>
        </Button>
    );
}

function toneClasses(tone: ItemTone = "neutral") {
    if (tone === "positive") {
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    }
    if (tone === "warning") {
        return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    }
    return "border-border bg-muted/40 text-muted-foreground";
}

function TrendIcon({ trend }: { readonly trend: TrendTone }) {
    if (trend === "up") {
        return <IconTrendingUp className="size-4" />;
    }
    if (trend === "down") {
        return <IconTrendingDown className="size-4" />;
    }
    return <IconMinus className="size-4" />;
}

function SectionTabs({ tabs }: { readonly tabs?: ReadonlyArray<DashboardTab> }) {
    if (!tabs || tabs.length === 0) {
        return null;
    }

    return (
        <div className="inline-flex h-9 items-center rounded-lg bg-muted p-1 text-muted-foreground">
            {tabs.map((tab) => (
                <button
                    key={tab.label}
                    type="button"
                    disabled={tab.disabled}
                    className={cn(
                        "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors",
                        tab.active && "bg-background text-foreground shadow-sm",
                        tab.disabled && "cursor-not-allowed opacity-50"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

function MetricCard({ metric }: { readonly metric: DashboardMetric }) {
    const isPositive = metric.trend === "up";
    const isNegative = metric.trend === "down";

    return (
        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <CardHeader className="grid-cols-[1fr_auto] items-start gap-3">
                <div className="space-y-1.5">
                    <CardDescription>{metric.label}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {metric.value}
                    </CardTitle>
                </div>
                <CardAction>
                    <Badge
                        variant="outline"
                        className={cn(
                            isPositive && "text-emerald-700 dark:text-emerald-300",
                            isNegative && "text-rose-700 dark:text-rose-300"
                        )}
                    >
                        <TrendIcon trend={metric.trend} />
                        {metric.delta}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    {metric.headline}
                    <TrendIcon trend={metric.trend} />
                </div>
                <div className="text-muted-foreground">{metric.detail}</div>
            </CardFooter>
        </Card>
    );
}

function MetricsGrid({ metrics }: { readonly metrics: ReadonlyArray<DashboardMetric> }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
            ))}
        </div>
    );
}

function BarChartCard({ chart }: { readonly chart: DashboardBarChartCard }) {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeSeries = chart.series[activeIndex] ?? chart.series[0];

    if (!activeSeries) {
        return null;
    }

    const maxValue = Math.max(...activeSeries.points, 1);

    return (
        <Card className="overflow-hidden !pt-3">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 sm:py-0">
                    <CardTitle>{chart.title}</CardTitle>
                    <CardDescription>{chart.description}</CardDescription>
                </div>
                <div className="flex">
                    {chart.series.map((series, index) => (
                        <button
                            key={series.label}
                            type="button"
                            data-active={activeIndex === index}
                            className="data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                            onClick={() => setActiveIndex(index)}
                        >
                            <span className="text-muted-foreground text-xs">{series.label}</span>
                            <span className="text-lg leading-none font-bold sm:text-3xl">
                                {series.total}
                            </span>
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <div className="relative h-[250px]">
                    <div className="absolute inset-0 flex flex-col justify-between pb-8">
                        {[0, 1, 2, 3].map((line) => (
                            <div key={line} className="border-border/60 border-t border-dashed" />
                        ))}
                    </div>
                    <div className="absolute inset-x-0 bottom-8 top-4 flex items-end gap-2">
                        {activeSeries.points.map((point, index) => (
                            <div key={`${activeSeries.label}-${chart.labels[index]}`} className="flex flex-1 items-end">
                                <div
                                    className="w-full rounded-t-md bg-gradient-to-t from-primary/20 to-primary/80"
                                    style={{ height: `${Math.max((point / maxValue) * 100, 8)}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="text-muted-foreground absolute inset-x-0 bottom-0 flex justify-between gap-2 text-xs">
                        {chart.labels.map((label, index) => (
                            <span
                                key={label}
                                className={cn(
                                    "truncate",
                                    index !== 0 &&
                                        index !== chart.labels.length - 1 &&
                                        index % Math.ceil(chart.labels.length / 4) !== 0 &&
                                        "hidden sm:inline-flex"
                                )}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function createAreaPath(points: ReadonlyArray<number>, width: number, height: number, padding: number) {
    const max = Math.max(...points, 1);
    const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
    const baseline = height - padding;

    const coordinates = points.map((value, index) => {
        const x = padding + step * index;
        const y = baseline - (value / max) * (height - padding * 2);
        return { x, y };
    });

    const line = coordinates
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];

    return `${line} L ${last?.x ?? padding} ${baseline} L ${first?.x ?? padding} ${baseline} Z`;
}

function AreaChartCard({ chart }: { readonly chart: DashboardAreaChartCard }) {
    const width = 520;
    const height = 250;
    const primary = chart.series[0]?.points ?? [];
    const secondary = chart.series[1]?.points ?? [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{chart.title}</CardTitle>
                <CardDescription>{chart.description}</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <div className="h-[250px] w-full">
                    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
                        <defs>
                            <linearGradient id="dashboard-area-primary" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity="0.9" />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity="0.08" />
                            </linearGradient>
                            <linearGradient id="dashboard-area-secondary" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity="0.7" />
                                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity="0.04" />
                            </linearGradient>
                        </defs>
                        {[0, 1, 2, 3].map((line) => (
                            <line
                                key={line}
                                x1="24"
                                x2={width - 24}
                                y1={24 + line * 50}
                                y2={24 + line * 50}
                                stroke="var(--border)"
                                strokeDasharray="4 6"
                            />
                        ))}
                        {secondary.length > 0 ? (
                            <path
                                d={createAreaPath(secondary, width, height, 24)}
                                fill="url(#dashboard-area-secondary)"
                                stroke="var(--chart-2)"
                                strokeWidth="2"
                            />
                        ) : null}
                        <path
                            d={createAreaPath(primary, width, height, 24)}
                            fill="url(#dashboard-area-primary)"
                            stroke="var(--primary)"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
                <div className="text-muted-foreground mt-3 flex justify-between gap-2 text-xs">
                    {chart.labels.map((label, index) => (
                        <span
                            key={label}
                            className={cn(
                                "truncate",
                                index !== 0 &&
                                    index !== chart.labels.length - 1 &&
                                    index % Math.ceil(chart.labels.length / 4) !== 0 &&
                                    "hidden sm:inline-flex"
                            )}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                        {chart.footerTitle}
                        <IconTrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground">{chart.footerNote}</div>
                </div>
            </CardFooter>
        </Card>
    );
}

function DonutChartCard({ chart }: { readonly chart: DashboardDonutChartCard }) {
    const total = chart.slices.reduce((sum, slice) => sum + slice.value, 0);
    const gradient = chart.slices
        .map((slice, index) => {
            const start =
                chart.slices
                    .slice(0, index)
                    .reduce((sum, current) => sum + current.value, 0) / total;
            const end =
                chart.slices
                    .slice(0, index + 1)
                    .reduce((sum, current) => sum + current.value, 0) / total;
            return `${donutColors[index % donutColors.length]} ${start * 360}deg ${end * 360}deg`;
        })
        .join(", ");

    return (
        <Card>
            <CardHeader>
                <CardTitle>{chart.title}</CardTitle>
                <CardDescription>{chart.description}</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <div className="mx-auto grid h-[250px] place-items-center">
                    <div
                        className="grid h-48 w-48 place-items-center rounded-full"
                        style={{ background: `conic-gradient(${gradient})` }}
                    >
                        <div className="bg-background grid h-28 w-28 place-items-center rounded-full border shadow-sm">
                            <div className="text-center">
                                <div className="text-3xl font-bold tabular-nums">
                                    {total.toLocaleString()}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    {chart.totalLabel}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {chart.slices.map((slice, index) => (
                        <div key={slice.label} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span
                                    className="size-2.5 rounded-full"
                                    style={{ backgroundColor: donutColors[index % donutColors.length] }}
                                />
                                <span>{slice.label}</span>
                            </div>
                            <span className="text-muted-foreground tabular-nums">
                                {Math.round((slice.value / total) * 100)}%
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    {chart.footerTitle}
                    <IconTrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground">{chart.footerNote}</div>
            </CardFooter>
        </Card>
    );
}

function ActivityCard({ card }: { readonly card: DashboardActivityCard }) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {card.items.map((item) => (
                        <div key={`${item.title}-${item.value}`} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{item.initials}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm leading-none font-medium">{item.title}</p>
                                <p className="text-muted-foreground text-sm">{item.subtitle}</p>
                            </div>
                            <div className="ml-auto font-medium">{item.value}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function TableCard({ card }: { readonly card: DashboardTableCard }) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-hidden rounded-xl border">
                    <div className="bg-muted/50 text-muted-foreground grid grid-cols-[1.35fr_1fr_1fr_auto] gap-4 border-b px-4 py-3 text-xs font-medium uppercase tracking-[0.18em]">
                        {card.columns.map((column) => (
                            <span key={column}>{column}</span>
                        ))}
                    </div>
                    {card.rows.map((row) => (
                        <div
                            key={`${row.primary}-${row.secondary}-${row.tertiary}`}
                            className="grid grid-cols-[1.35fr_1fr_1fr_auto] gap-4 border-b px-4 py-4 last:border-b-0"
                        >
                            <div>
                                <div className="font-medium">{row.primary}</div>
                                <div className="text-muted-foreground mt-1 text-sm">{row.meta}</div>
                            </div>
                            <div className="text-sm">{row.secondary}</div>
                            <div className="text-muted-foreground text-sm">{row.tertiary}</div>
                            <div>
                                <span
                                    className={cn(
                                        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                                        toneClasses(row.tone)
                                    )}
                                >
                                    {row.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {card.footer ? <p className="text-muted-foreground mt-4 text-sm">{card.footer}</p> : null}
            </CardContent>
        </Card>
    );
}

function InsightCard({ card }: { readonly card: DashboardInsightCard }) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {card.items.map((item) => (
                    <div key={item.label} className="rounded-xl border bg-muted/20 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium">{item.label}</p>
                                <p className="text-muted-foreground mt-1 text-sm">{item.hint}</p>
                            </div>
                            <span
                                className={cn(
                                    "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                                    toneClasses(item.tone)
                                )}
                            >
                                {item.value}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function FormCard({ form }: { readonly form: DashboardFormCard }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{form.title}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {form.sections.map((section) => (
                        <section key={section.title} className="space-y-5 border-b pb-6 last:border-b-0 last:pb-0">
                            <div className="space-y-1">
                                <h3 className="font-medium">{section.title}</h3>
                                <p className="text-muted-foreground text-sm">{section.description}</p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {section.fields.map((field) => (
                                    <label key={`${section.title}-${field.label}`} className="space-y-2">
                                        <span className="text-sm font-medium">{field.label}</span>
                                        {field.kind === "textarea" ? (
                                            <textarea
                                                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1"
                                                placeholder={field.placeholder}
                                            />
                                        ) : (
                                            <Input type={field.type ?? "text"} placeholder={field.placeholder} />
                                        )}
                                        {field.helper ? (
                                            <span className="text-muted-foreground block text-xs">
                                                {field.helper}
                                            </span>
                                        ) : null}
                                    </label>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="justify-end">
                <Button type="button">{form.submitLabel}</Button>
            </CardFooter>
        </Card>
    );
}

export function DashboardOverviewTemplate({
    greeting,
    actionLabel,
    actionHref,
    tabs,
    metrics,
    barChart,
    areaChart,
    donutChart,
    activity,
}: DashboardOverviewTemplateProps) {
    return (
        <PageContainer>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold tracking-tight">{greeting}</h2>
                    {actionLabel ? (
                        <div className="hidden items-center space-x-2 md:flex">
                            <TemplateAction actionLabel={actionLabel} actionHref={actionHref} />
                        </div>
                    ) : null}
                </div>
                <SectionTabs tabs={tabs} />
                <MetricsGrid metrics={metrics} />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4">
                        <BarChartCard chart={barChart} />
                    </div>
                    <div className="col-span-4 md:col-span-3">
                        <ActivityCard card={activity} />
                    </div>
                    <div className="col-span-4">
                        <AreaChartCard chart={areaChart} />
                    </div>
                    <div className="col-span-4 md:col-span-3">
                        <DonutChartCard chart={donutChart} />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}

export function DashboardTablePageTemplate({
    pageTitle,
    pageDescription,
    actionLabel,
    actionHref,
    tabs,
    metrics,
    table,
    insights,
    barChart,
    donutChart,
}: DashboardTablePageTemplateProps) {
    return (
        <PageContainer
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageHeaderAction={
                <TemplateAction actionLabel={actionLabel} actionHref={actionHref} />
            }
        >
            <div className="space-y-4">
                <SectionTabs tabs={tabs} />
                <MetricsGrid metrics={metrics} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                    <div className="lg:col-span-4">
                        <TableCard card={table} />
                    </div>
                    <div className="lg:col-span-3">
                        <InsightCard card={insights} />
                    </div>
                </div>
                {barChart && donutChart ? (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                        <div className="lg:col-span-4">
                            <BarChartCard chart={barChart} />
                        </div>
                        <div className="lg:col-span-3">
                            <DonutChartCard chart={donutChart} />
                        </div>
                    </div>
                ) : null}
            </div>
        </PageContainer>
    );
}

export function DashboardFormPageTemplate({
    pageTitle,
    pageDescription,
    actionLabel,
    actionHref,
    tabs,
    metrics,
    form,
    notes,
    checklist,
}: DashboardFormPageTemplateProps) {
    return (
        <PageContainer
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageHeaderAction={
                <TemplateAction actionLabel={actionLabel} actionHref={actionHref} />
            }
        >
            <div className="space-y-4">
                <SectionTabs tabs={tabs} />
                <MetricsGrid metrics={metrics} />
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.95fr)]">
                    <FormCard form={form} />
                    <div className="space-y-4">
                        <InsightCard card={notes} />
                        {checklist ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{checklist.title}</CardTitle>
                                    <CardDescription>{checklist.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {checklist.items.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4"
                                        >
                                            <div className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <IconCheck className="size-3.5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">{item.label}</p>
                                                <p className="text-muted-foreground text-sm">{item.hint}</p>
                                                <span
                                                    className={cn(
                                                        "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium",
                                                        toneClasses(item.tone)
                                                    )}
                                                >
                                                    {item.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
