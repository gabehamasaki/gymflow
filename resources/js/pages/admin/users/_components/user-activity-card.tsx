'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp } from 'lucide-react';

interface UserActivityCardProps {
    stats: {
        total: number;
        active: number;
        inactive: number;
        suspended: number;
        newThisMonth: number;
    };
}

export function UserActivityCard({ stats }: UserActivityCardProps) {
    const activePercentage = (stats.active / stats.total) * 100;

    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Activity</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600 transition-transform duration-300 group-hover:scale-110 dark:text-green-400">
                    <Activity className="h-5 w-5" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{stats.active}</span>
                        <Badge variant="secondary" className="text-green-600 dark:text-green-400">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            {activePercentage.toFixed(1)}%
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Activity Rate</span>
                        <span className="font-medium">{activePercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-1000 ease-out"
                            style={{ width: `${activePercentage}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="text-muted-foreground">Suspended: {stats.suspended}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">Inactive: {stats.inactive}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
