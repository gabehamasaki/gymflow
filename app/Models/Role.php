<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'is_default',
        'is_active',
        'color',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    public static function getDefaultRole()
    {
        return self::where('is_default', true)->first();
    }

    public static function getRoleByName($name)
    {
        return self::where('name', $name)->first();
    }
}
