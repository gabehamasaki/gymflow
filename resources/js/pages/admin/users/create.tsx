'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Permission } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Eye, EyeOff, Key, Mail, Save, Settings, Shield, Upload, UserPlus, Users, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface CreateUserProps {
    roles: Array<{
        id: number;
        name: string;
        description: string;
        permissions: Permission[];
    }>;
    availablePermissions: Permission[];
    errors?: Record<string, string>;
    success?: string;
}

export default function CreateUser({ roles, availablePermissions, errors = {}, success }: CreateUserProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('basic');

    const { data, setData, post, processing, isDirty } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        status: 'active',
        phone: '',
        avatar: null as File | null,
        timezone: 'UTC',
        permissions: [] as string[],
        email_verified: false,
        two_factor_enabled: false,
        notifications_enabled: true,
        marketing_emails: false,
        send_welcome_email: true,
        force_password_reset: false,
    });

    useEffect(() => {
        let newRole = roles.find((item) => item.name === data.role);
        setData('permissions', newRole ? newRole.permissions.map((p) => p.name) : []);
    }, [data.role]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Users', href: '/admin/users' },
        { title: 'Create User', href: '/admin/users/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => {
                router.visit('/admin/users');
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

    const statusOptions = [
        { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
        { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: Clock },
        { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    ];

    const roleOptions = roles.map((role) => ({
        value: role.name,
        label: role.name,
        description: role.description,
    }));

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        const newPermissions = checked ? [...data.permissions, permissionId] : data.permissions.filter((p) => p !== permissionId);
        setData('permissions', newPermissions);
    };

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setData('password', password);
        setData('password_confirmation', password);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New User" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <UserPlus className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
                            <p className="text-muted-foreground">Add a new user to the system</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleCancel} disabled={processing}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Creating...' : 'Create User'}
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

                <form onSubmit={handleSubmit}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="permissions">Permissions</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        </TabsList>

                        {/* Basic Info Tab */}
                        <TabsContent value="basic" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-3">
                                <div className="space-y-6 lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Users className="h-5 w-5" />
                                                User Information
                                            </CardTitle>
                                            <CardDescription>Enter the basic information for the new user</CardDescription>
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
                                                        required
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
                                                        required
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
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Account Settings</CardTitle>
                                            <CardDescription>Configure the user's account status and initial settings</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="role">Role *</Label>
                                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {roleOptions.map((role) => (
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
                                                    <Label htmlFor="status">Initial Status</Label>
                                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
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
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="email-verified">Email Pre-verified</Label>
                                                        <p className="text-sm text-muted-foreground">Mark email as verified on creation</p>
                                                    </div>
                                                    <Switch
                                                        id="email-verified"
                                                        checked={data.email_verified}
                                                        onCheckedChange={(checked) => setData('email_verified', checked)}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="send-welcome">Send Welcome Email</Label>
                                                        <p className="text-sm text-muted-foreground">Send welcome email with login instructions</p>
                                                    </div>
                                                    <Switch
                                                        id="send-welcome"
                                                        checked={data.send_welcome_email}
                                                        onCheckedChange={(checked) => setData('send_welcome_email', checked)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Profile Picture</CardTitle>
                                            <CardDescription>Upload an avatar for the new user</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex flex-col items-center space-y-4">
                                                <Avatar className="h-32 w-32">
                                                    <AvatarImage src={avatarPreview || '/images/default-avatar.png'} alt="User avatar" />
                                                    <AvatarFallback className="text-3xl">
                                                        {data.name ? data.name.charAt(0).toUpperCase() : 'U'}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex flex-col items-center space-y-2">
                                                    <Label htmlFor="avatar" className="cursor-pointer">
                                                        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                                                            <Upload className="h-4 w-4" />
                                                            Upload Photo
                                                        </div>
                                                        <Input
                                                            id="avatar"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleAvatarChange}
                                                            className="hidden"
                                                        />
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">JPG, PNG up to 2MB</p>
                                                </div>
                                            </div>
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
                                            <Key className="h-5 w-5" />
                                            Password Setup
                                        </CardTitle>
                                        <CardDescription>Set up the initial password for the new user</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password">Password *</Label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={generateRandomPassword}
                                                        className="bg-transparent text-xs"
                                                    >
                                                        Generate Random
                                                    </Button>
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        placeholder="Enter password"
                                                        className={errors.password ? 'border-red-500' : ''}
                                                        required
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation">Confirm Password *</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password_confirmation"
                                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                                        value={data.password_confirmation}
                                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                                        placeholder="Confirm password"
                                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                                        required
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                    >
                                                        {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                {errors.password_confirmation && (
                                                    <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <p>Password requirements:</p>
                                                <ul className="list-inside list-disc space-y-1">
                                                    <li>At least 8 characters long</li>
                                                    <li>Contains uppercase and lowercase letters</li>
                                                    <li>Contains at least one number</li>
                                                    <li>Contains at least one special character</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5" />
                                            Security Options
                                        </CardTitle>
                                        <CardDescription>Configure initial security settings</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="two-factor">Enable 2FA</Label>
                                                    <p className="text-sm text-muted-foreground">Require two-factor authentication</p>
                                                </div>
                                                <Switch
                                                    id="two-factor"
                                                    checked={data.two_factor_enabled}
                                                    onCheckedChange={(checked) => setData('two_factor_enabled', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="force-password-reset">Force Password Change</Label>
                                                    <p className="text-sm text-muted-foreground">User must change password on first login</p>
                                                </div>
                                                <Switch
                                                    id="force-password-reset"
                                                    checked={data.force_password_reset}
                                                    onCheckedChange={(checked) => setData('force_password_reset', checked)}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Security Notes</Label>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <p>• User will receive login credentials via email</p>
                                                <p>• 2FA setup will be required on first login if enabled</p>
                                                <p>• Password reset link expires in 24 hours</p>
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
                                        Set specific permissions for this user. These will override role-based permissions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Permissions</h4>
                                            <div className="grid gap-3 md:grid-cols-2">
                                                {availablePermissions.map((permission) => (
                                                    <div key={permission.name} className="flex items-start space-x-3">
                                                        <Checkbox
                                                            id={permission.name}
                                                            checked={data.permissions.includes(permission.name)}
                                                            onCheckedChange={(checked) => handlePermissionChange(permission.name, checked as boolean)}
                                                        />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <Label
                                                                htmlFor={permission.name}
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

                        {/* Preferences Tab */}
                        <TabsContent value="preferences" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="h-5 w-5" />
                                            Notification Preferences
                                        </CardTitle>
                                        <CardDescription>Configure default notification settings for the new user</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="notifications">System Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">Enable system and security notifications</p>
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
                                                    <p className="text-sm text-muted-foreground">Receive promotional and marketing emails</p>
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
                                        <CardTitle className="flex items-center gap-2">
                                            <Mail className="h-5 w-5" />
                                            Welcome Setup
                                        </CardTitle>
                                        <CardDescription>Configure the user onboarding experience</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="rounded-lg border p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium">Welcome Email</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Send account details and first login instructions
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={data.send_welcome_email}
                                                        onCheckedChange={(checked) => setData('send_welcome_email', checked)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="rounded-lg border p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium">Password Reset Required</p>
                                                        <p className="text-xs text-muted-foreground">Force password change on first login</p>
                                                    </div>
                                                    <Switch
                                                        checked={data.force_password_reset}
                                                        onCheckedChange={(checked) => setData('force_password_reset', checked)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Onboarding Checklist</Label>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <p>✓ Account creation</p>
                                                <p>✓ Email verification (if enabled)</p>
                                                <p>✓ Welcome email (if enabled)</p>
                                                <p>✓ First login setup</p>
                                                <p>✓ Profile completion</p>
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
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    Ready to create user
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={handleCancel} disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                {processing ? 'Creating User...' : 'Create User'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
