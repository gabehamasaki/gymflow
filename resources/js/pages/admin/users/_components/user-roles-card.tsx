'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldCheck, Users } from 'lucide-react';

interface User {
    role: 'admin' | 'user' | 'moderator';
}

interface UserRolesCardProps {
    users: User[];
}

export function UserRolesCard({ users }: UserRolesCardProps) {
    const roleStats = users.reduce(
        (acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    const roles = [
        {
            name: 'Admins',
            count: roleStats.admin || 0,
            icon: ShieldCheck,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-500/10',
        },
        {
            name: 'Moderators',
            count: roleStats.moderator || 0,
            icon: Shield,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-500/10',
        },
        {
            name: 'Users',
            count: roleStats.user || 0,
            icon: Users,
            color: 'text-gray-600 dark:text-gray-400',
            bgColor: 'bg-gray-500/10',
        },
    ];

    const totalUsers = users.length;
    const adminPercentage = ((roleStats.admin || 0) / totalUsers) * 100;

    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Roles</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 transition-transform duration-300 group-hover:scale-110 dark:text-purple-400">
                    <Shield className="h-5 w-5" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {roles.map((role) => (
                        <div key={role.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`flex h-6 w-6 items-center justify-center rounded ${role.bgColor} ${role.color}`}>
                                    <role.icon className="h-3 w-3" />
                                </div>
                                <span className="text-sm font-medium">{role.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                {role.count}
                            </Badge>
                        </div>
                    ))}
                </div>

                <div className="border-t border-sidebar-border/50 pt-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Admin Coverage</span>
                        <span className="font-medium">{adminPercentage.toFixed(1)}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
