<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{

    protected $permissions = [
        [
            'description' => 'View Dashboard',
            'name' => 'view_dashboard',
            'is_active' => true,
        ],
        [
            'description' => 'View Admin',
            'name' => 'view_admin',
            'is_active' => true,
        ],
        [
            'description' => 'View Users',
            'name' => 'view_users',
            'is_active' => true,
        ],
        [
            'description' => 'Create User',
            'name' => 'store_user',
            'is_active' => true,
        ],
        [
            'description' => 'Update User',
            'name' => 'update_user',
            'is_active' => true,
        ],
        [
            'description' => 'Delete User',
            'name' => 'delete_user',
            'is_active' => true,
        ],
        [
            'description' => 'Restore User',
            'name' => 'restore_user',
            'is_active' => true,
        ],
        [
            'description' => 'Force Delete User',
            'name' => 'force_delete_user',
            'is_active' => true,
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->permissions as $permission) {
            \App\Models\Permission::updateOrCreate(
                ['name' => $permission['name']],
                [
                    'description' => $permission['description'],
                    'is_active' => $permission['is_active'],
                ]
            );
        }
    }
}
