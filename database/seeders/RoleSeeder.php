<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{

    protected $roles = [
        [
            'name' => 'admin',
            'description' => 'Administrator with full access',
            'is_default' => false,
            'is_active' => true,
            'color' => '#FF0000',
            'permissions' => [
                'view_dashboard',
                'view_users',
                'store_user',
                'update_user',
                'delete_user',
                'restore_user',
                'force_delete_user',
            ],
        ],
        [
            'name' => 'user',
            'description' => 'Regular user with limited access',
            'is_default' => true,
            'is_active' => true,
            'color' => '#00FF00',
            'permissions' => [
                'view_dashboard',
            ],
        ],
    ];

    public function run(): void
    {
        foreach ($this->roles as $role) {
            \App\Models\Role::updateOrCreate(
                ['name' => $role['name']],
                [
                    'description' => $role['description'],
                    'is_default' => $role['is_default'],
                    'is_active' => $role['is_active'],
                    'color' => $role['color'],
                ]
            );

            foreach ($role['permissions'] as $permissionName) {
                $permission = \App\Models\Permission::getPermission($permissionName);
                if ($permission) {
                    $roleModel = \App\Models\Role::where('name', $role['name'])->first();
                    if ($roleModel) {
                        $roleModel->permissions()->attach($permission->id);
                    }
                }
            }
        }
    }
}
