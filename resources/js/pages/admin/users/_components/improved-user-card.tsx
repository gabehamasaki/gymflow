'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Minus, TrendingDown, TrendingUp, Users2 } from 'lucide-react';

interface UserCardProps {
    users: any[];
    previousCount?: number;
    isLoading?: boolean;
    className?: string;
}

export function ImprovedUserCard({ users, previousCount, isLoading = false, className }: UserCardProps) {
    const currentCount = users.length;
    const hasComparison = previousCount !== undefined;

    // Calculate trend
    const getTrend = () => {
        if (!hasComparison) return null;

        const difference = currentCount - previousCount;
        const percentageChange = previousCount > 0 ? (difference / previousCount) * 100 : 0;

        return {
            difference,
            percentage: Math.abs(percentageChange),
            direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral',
        };
    };

    const trend = getTrend();

    const getTrendIcon = () => {
        if (!trend) return null;

        switch (trend.direction) {
            case 'up':
                return <TrendingUp className="h-4 w-4" />;
            case 'down':
                return <TrendingDown className="h-4 w-4" />;
            default:
                return <Minus className="h-4 w-4" />;
        }
    };

    const getTrendColor = () => {
        if (!trend) return '';

        switch (trend.direction) {
            case 'up':
                return 'text-green-600 dark:text-green-400';
            case 'down':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-muted-foreground';
        }
    };

    if (isLoading) {
        return (
            <Card className={cn('relative overflow-hidden', className)}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-12 w-16" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className={cn(
                'group relative overflow-hidden transition-all duration-300 hover:shadow-lg',
                'bg-gradient-to-br from-background to-muted/20',
                'border-sidebar-border/70 dark:border-sidebar-border',
                className,
            )}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users2 className="h-5 w-5" />
                            <h3 className="font-medium">Total Users</h3>
                        </div>

                        <div className="space-y-1">
                            <p className="text-4xl font-bold tracking-tight">{currentCount.toLocaleString()}</p>

                            {trend && (
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className={cn('flex items-center gap-1 text-xs font-medium', getTrendColor())}>
                                        {getTrendIcon()}
                                        {trend.percentage.toFixed(1)}%
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                                        {Math.abs(trend.difference)} from last period
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Icon with background */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 transition-transform duration-300 group-hover:scale-110 dark:text-blue-400">
                        <Users2 className="h-6 w-6" />
                    </div>
                </div>

                {/* Progress bar or additional info */}
                <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Active Users</span>
                        <span>{Math.floor(currentCount * 0.8)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                            style={{ width: '80%' }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
