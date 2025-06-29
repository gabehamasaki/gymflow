<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'avatar',
        'first_login_at',
        'last_login_at',
        'last_password_change_at',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => UserStatus::class,
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'last_password_change_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user', 'user_id', 'permission_id');
    }

    public function hasPermission(string $permission): bool
    {
        return !$this->permissions->isEmpty() ? $this->permissions->contains('name', $permission) : $this->role->permissions->contains('name', $permission);
    }

    public function getAllPermissions(): array
    {
        return !$this->permissions->isEmpty() ? $this->permissions->map(fn($item) => ['name' => $item->name, 'is_active' => $item->is_active])->unique()->toArray() : $this->role->permissions->map(fn($item) => ['name' => $item->name, 'is_active' => $item->is_active])->unique()->toArray();
    }

    public function syncPermissions($permissions): void
    {
        $permissionIds = Permission::whereIn('name', $permissions)->get()->pluck('id')->toArray();
        $this->permissions()->sync($permissionIds);
    }
}
