import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function can(permission: string): boolean {
    const page = usePage<SharedData>().props;
    if (!page.auth.user || page.auth.permissions.length < 0) {
        return false;
    }

    return page.auth.permissions.some((p) => p.name === permission && p.is_active);
}
