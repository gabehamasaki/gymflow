<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\UserStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $p = Str::random(20);
        $admin = User::create([
            'name' => 'Gabriel Hamasaki',
            'username' => 'gabriel.hamasaki',
            'email' => 'gabriel.hamasaki@gymflow.com',
            'email_verified_at' => now(),
            'password' => bcrypt($p),
            'status' => UserStatus::ACTIVE,
            'role_id' => Role::getRoleByName('admin')->id,
        ]);


        $this->command->info('Admin user created with password: ' . $p);
        $this->command->info('Please change the password after logging in for the first time.');
    }
}
