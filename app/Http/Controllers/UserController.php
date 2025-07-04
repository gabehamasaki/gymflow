<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('admin/users/index', [
            'users' => User::with('role')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('admin/users/create', [
            'roles' => Role::all()->map(function ($item) {
                $item->with('permissions');
                return [
                    'name' => $item->name,
                    'description' => $item->description,
                    'permissions' => $item->permissions->map(fn($item) => ['name' => $item->name, 'description' => $item->description, 'is_active' => $item->is_active])
                ];
            }),
            'availablePermissions' => Permission::where('is_active', true)->get()->map(function ($permission) {
                return ['name' => $permission->name, 'description' => $permission->description];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return inertia('admin/users/edit', [
            'user' => $user->load('role'),
            'roles' => \App\Models\Role::all(),
            'permissions' => \App\Models\Permission::all()->pluck('name'),
            'availablePermissions' => \App\Models\Permission::where('is_active', true)->get()->map(function ($permission) {
                return ['name' => $permission->name, 'description' => $permission->description];
            }),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
