'use client';

import { DataTable } from '@/components/datatable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Mail, MoreHorizontal, ShieldCheck, Trash2 } from 'lucide-react';
import { ImprovedUserCard } from './_components/improved-user-card';
import { UserActivityCard } from './_components/user-activity-card';

// Improved User interface
interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    last_login_at?: string;
    email_verified_at?: string;
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || '/images/default-avatar.png'} alt={user.name} />
                        <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusConfig = {
                active: {
                    label: 'Active',
                    variant: 'default' as const,
                    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                },
                inactive: {
                    label: 'Inactive',
                    variant: 'destructive' as const,
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                },
                suspended: {
                    label: 'Suspended',
                    variant: 'outline' as const,
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                },
            };

            const config = statusConfig[status as keyof typeof statusConfig];

            return (
                <Badge variant={config.variant} className={config.className}>
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.getValue('role') as any;
            const roleConfig = {
                admin: { label: 'Admin', icon: ShieldCheck, className: '' },
                user: { label: 'User', icon: null, className: 'text-gray-600 dark:text-gray-400' },
            };

            const config = roleConfig[role.name as keyof typeof roleConfig] ?? roleConfig['user'];
            const Icon = config.icon;

            return (
                <div className={`flex items-center gap-1 ${config.className}`} style={{ color: role.color || 'inherit' }}>
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="font-medium">{config.label}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'email_verified_at',
        header: 'Verified',
        cell: ({ row }) => {
            const verified = row.getValue('email_verified_at');
            return verified ? (
                <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                    <Mail className="mr-1 h-3 w-3" />
                    Verified
                </Badge>
            ) : (
                <Badge
                    variant="outline"
                    className="border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                    Unverified
                </Badge>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Joined',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return (
                <div className="flex flex-col">
                    <span className="text-sm">{date.toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'last_login_at',
        header: 'Last Login',
        cell: ({ row }) => {
            const lastLogin = row.getValue('last_login_at') as string;
            if (!lastLogin) {
                return <span className="text-sm text-muted-foreground">Never</span>;
            }

            const date = new Date(lastLogin);
            const now = new Date();
            const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

            let timeAgo = '';
            if (diffInHours < 1) {
                timeAgo = 'Just now';
            } else if (diffInHours < 24) {
                timeAgo = `${diffInHours}h ago`;
            } else {
                const diffInDays = Math.floor(diffInHours / 24);
                timeAgo = `${diffInDays}d ago`;
            }

            return (
                <div className="flex flex-col">
                    <span className="text-sm">{timeAgo}</span>
                    <span className="text-xs text-muted-foreground">{date.toLocaleDateString()}</span>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const user = row.original;

            const handleEdit = () => {
                router.visit(`/admin/users/${user.id}/edit`);
            };

            const handleDelete = () => {
                if (confirm('Are you sure you want to delete this user?')) {
                    router.delete(`/admin/users/${user.id}`);
                }
            };

            const handleToggleStatus = () => {
                const newStatus = user.status === 'active' ? 'inactive' : 'active';
                router.patch(`/admin/users/${user.id}`, { status: newStatus });
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>Copy email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {can('update_user') && (
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit user
                            </DropdownMenuItem>
                        )}
                        {can('update_user') && (
                            <DropdownMenuItem onClick={handleToggleStatus}>
                                {user.status === 'active' ? 'Deactivate' : 'Activate'} user
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {can('delete_user') && (
                            <DropdownMenuItem onClick={handleDelete} className="text-red-600 dark:text-red-400">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete user
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

interface UsersProps {
    users: User[];
    stats?: {
        total: number;
        active: number;
        inactive: number;
        suspended: number;
        newThisMonth: number;
        previousMonthTotal: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

export default function Users({ users, stats }: UsersProps) {
    // Calculate stats if not provided
    const calculatedStats = stats || {
        total: users.length,
        active: users.filter((u) => u.status === 'active').length,
        inactive: users.filter((u) => u.status === 'inactive').length,
        suspended: users.filter((u) => u.status === 'suspended').length,
        newThisMonth: users.filter((u) => {
            const createdAt = new Date(u.created_at);
            const now = new Date();
            return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
        }).length,
        previousMonthTotal: users.length - 50, // Mock data - replace with real calculation
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                        <p className="text-muted-foreground">Manage and monitor all users in your application</p>
                    </div>
                    <Button onClick={() => router.visit('/admin/users/create')}>Add User</Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <ImprovedUserCard users={users} previousCount={calculatedStats.previousMonthTotal} />
                    <UserActivityCard stats={calculatedStats} />
                    {/* <UserRolesCard users={users} /> */}
                </div>

                {/* Data Table */}
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="border-b border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <h2 className="text-lg font-semibold">All Users</h2>
                        <p className="text-sm text-muted-foreground">{users.length} total users</p>
                    </div>
                    <DataTable columns={columns} data={users} />
                </div>
            </div>
        </AppLayout>
    );
}
