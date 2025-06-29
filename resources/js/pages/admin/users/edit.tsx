'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertCircle, AlertTriangle, Ban, CheckCircle, Clock, Key, Lock, Mail, Save, Settings, Shield, Trash2, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface AdminEditUserProps {
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        status: 'active' | 'inactive' | 'pending' | 'suspended' | 'banned';
        role_id: number;
        role: any;
        bio?: string;
        phone?: string;
        created_at: string;
        updated_at: string;
        last_login_at?: string;
        email_verified_at?: string;
        two_factor_enabled: boolean;
        login_attempts: number;
        last_login_ip?: string;
        timezone?: string;
        language: string;
        notifications_enabled: boolean;
        marketing_emails: boolean;
    };
    roles: any;
    permissions: string[];
    availablePermissions: Array<{
        id: string;
        name: string;
        description: string;
    }>;
    errors?: Record<string, string>;
    success?: string;
}

export default function AdminEditUser({ user, permissions, availablePermissions, roles, errors = {}, success }: AdminEditUserProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('profile');

    const { data, setData, patch, processing, isDirty } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role.name || 'user',
        status: user.status || 'active',
        bio: user.bio || '',
        phone: user.phone || '',
        avatar: null as File | null,
        two_factor_enabled: user.two_factor_enabled || false,
        email_verified: !!user.email_verified_at,
        permissions: permissions || [],
        timezone: user.timezone || 'UTC',
        language: user.language || 'en',
        notifications_enabled: user.notifications_enabled ?? true,
        marketing_emails: user.marketing_emails ?? false,
        force_password_reset: false,
        account_locked: user.status === 'suspended' || user.status === 'inactive',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Users', href: '/admin/users' },
        { title: `Edit ${user.name}`, href: `/admin/users/${user.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/users/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        if (isDirty) {
            if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
                router.visit('/admin/users');
            }
        } else {
            router.visit('/admin/users');
        }
    };

    const handleResetPassword = () => {
        router.post(`/admin/users/${user.id}/reset-password`);
    };

    const statusOptions = [
        { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
        { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: Clock },
        { value: 'suspended', label: 'Suspended', color: 'bg-orange-100 text-orange-800', icon: Ban },
    ];

    const roleOptions = roles.map((role: any) => {
        return {
            value: role.name,
            label: role.name,
            description: role.description,
        };
    });

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        const newPermissions = checked ? [...data.permissions, permissionId] : data.permissions.filter((p) => p !== permissionId);
        setData('permissions', newPermissions);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit - ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={avatarPreview || user.avatar || '/images/default-avatar.png'} alt={user.name} />
                            <AvatarFallback className="text-xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                                <Badge
                                    variant="outline"
                                    className={statusOptions.find((s) => s.value === user.status)?.color || 'bg-gray-100 text-gray-800'}
                                >
                                    {statusOptions.find((s) => s.value === user.status)?.label || user.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">User management and configuration</p>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                <span>ID: {user.id}</span>
                                <span>•</span>
                                <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                                {user.last_login_at && (
                                    <>
                                        <span>•</span>
                                        <span>Last login: {new Date(user.last_login_at).toLocaleDateString()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleCancel} disabled={processing}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing || !isDirty}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Please fix the errors below and try again.</AlertDescription>
                    </Alert>
                )}

                {/* Quick Actions */}
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-4">
                    <span className="text-sm font-medium">Quick Actions:</span>
                    <Button size="sm" variant="outline" onClick={handleResetPassword}>
                        <Key className="mr-2 h-4 w-4" />
                        Reset Password
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user account and remove all associated data from
                                    our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => router.delete(`/admin/users/${user.id}`)}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete User
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="permissions">Permissions</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-3">
                                <div className="space-y-6 lg:col-span-2">
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Basic Information</CardTitle>
                                            <CardDescription>Update the user's basic profile information</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        placeholder="Enter full name"
                                                        className={errors.name ? 'border-red-500' : ''}
                                                    />
                                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        placeholder="Enter email address"
                                                        className={errors.email ? 'border-red-500' : ''}
                                                    />
                                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone Number</Label>
                                                    <Input
                                                        id="phone"
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="timezone">Timezone</Label>
                                                    <Select value={data.timezone} onValueChange={(value) => setData('timezone', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select timezone" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="UTC">UTC</SelectItem>
                                                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                                                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                                                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                                                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                                                            <SelectItem value="Europe/London">London</SelectItem>
                                                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                                                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <Textarea
                                                    id="bio"
                                                    disabled
                                                    value={data.bio}
                                                    onChange={(e) => setData('bio', e.target.value)}
                                                    placeholder="Tell us about this user..."
                                                    rows={3}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Role & Status</CardTitle>
                                            <CardDescription>Manage user permissions and account status</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="role">Role</Label>
                                                <Select value={data.role} onValueChange={(value) => setData('role', value as any)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roleOptions.map((role: any) => (
                                                            <SelectItem key={role.value} value={role.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <span>{role.label}</span> -{' '}
                                                                        <span className="text-xs text-muted-foreground">{role.description}</span>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="status">Status</Label>
                                                <Select value={data.status} onValueChange={(value) => setData('status', value as any)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusOptions.map((status) => (
                                                            <SelectItem key={status.value} value={status.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <status.icon className="h-4 w-4" />
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`h-2 w-2 rounded-full ${status.color.split(' ')[0]}`} />
                                                                        {status.label}
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {data.status === 'suspended' && (
                                                <Alert>
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        This user is currently suspended and cannot access their account.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5" />
                                            Password & Authentication
                                        </CardTitle>
                                        <CardDescription>Manage user security and authentication settings</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="email-verified">Email Verified</Label>
                                                    <p className="text-sm text-muted-foreground">Mark email as verified</p>
                                                </div>
                                                <Switch
                                                    id="email-verified"
                                                    disabled
                                                    checked={data.email_verified}
                                                    onCheckedChange={(checked) => setData('email_verified', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="force-password-reset">Force Password Reset</Label>
                                                    <p className="text-sm text-muted-foreground">User must change password on next login</p>
                                                </div>
                                                <Switch
                                                    id="force-password-reset"
                                                    checked={data.force_password_reset}
                                                    onCheckedChange={(checked) => setData('force_password_reset', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="account-locked">Account Locked</Label>
                                                    <p className="text-sm text-muted-foreground">Prevent user from logging in</p>
                                                </div>
                                                <Switch
                                                    id="account-locked"
                                                    checked={data.account_locked}
                                                    onCheckedChange={(checked) => setData('account_locked', checked)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Lock className="h-5 w-5" />
                                            Security Information
                                        </CardTitle>
                                        <CardDescription>Current security status and login information</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">2FA Status</span>
                                                <Badge variant={user.two_factor_enabled ? 'default' : 'secondary'}>
                                                    {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                                                </Badge>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">Email Status</span>
                                                <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                                                    <Mail className="mr-1 h-3 w-3" />
                                                    {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Security Actions</Label>
                                            <div className="flex flex-col gap-2">
                                                <Button size="sm" variant="outline" onClick={handleResetPassword}>
                                                    <Key className="mr-2 h-4 w-4" />
                                                    Send Password Reset
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Permissions Tab */}
                        <TabsContent value="permissions" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        User Permissions
                                    </CardTitle>
                                    <CardDescription>
                                        Manage granular permissions for this user. These permissions override role-based permissions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">permissions</h4>
                                            <div className="grid gap-3 md:grid-cols-2">
                                                {availablePermissions.map((permission) => (
                                                    <div key={permission.id} className="flex items-start space-x-3">
                                                        <Checkbox
                                                            id={permission.id}
                                                            checked={can(permission.name)}
                                                            onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                                                        />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <Label
                                                                htmlFor={permission.id}
                                                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >
                                                                {permission.description}
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground">{permission.name}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Advanced Tab */}
                        <TabsContent value="advanced" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="h-5 w-5" />
                                            Preferences
                                        </CardTitle>
                                        <CardDescription>User preferences and notification settings</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="notifications">Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">Enable system notifications</p>
                                                </div>
                                                <Switch
                                                    id="notifications"
                                                    checked={data.notifications_enabled}
                                                    onCheckedChange={(checked) => setData('notifications_enabled', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="marketing">Marketing Emails</Label>
                                                    <p className="text-sm text-muted-foreground">Receive promotional emails</p>
                                                </div>
                                                <Switch
                                                    id="marketing"
                                                    checked={data.marketing_emails}
                                                    onCheckedChange={(checked) => setData('marketing_emails', checked)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-red-600">
                                            <AlertTriangle className="h-5 w-5" />
                                            Danger Zone
                                        </CardTitle>
                                        <CardDescription>Irreversible actions that affect this user account</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between rounded-lg border border-red-200 p-3">
                                                <div>
                                                    <p className="text-sm font-medium">Delete Account</p>
                                                    <p className="text-xs text-muted-foreground">Permanently delete this user account</p>
                                                </div>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the user account and remove
                                                                all associated data from our servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => router.delete(`/admin/users/${user.id}`)}
                                                                className="bg-red-600 text-white hover:bg-red-700"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Account
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between border-t pt-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {isDirty && (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                                    You have unsaved changes
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={handleCancel} disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing || !isDirty}>
                                {processing ? 'Saving...' : 'Save All Changes'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
