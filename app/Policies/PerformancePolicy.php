<?php

namespace App\Policies;

use App\Models\Performance;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PerformancePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('performance: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Performance $performance): bool
    {
        return $user->hasPermissionTo('performance: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('performance: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Performance $performance): bool
    {
        return $user->hasPermissionTo('performance: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Performance $performance): bool
    {
        return $user->hasPermissionTo('performance: delete') ? true : false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Performance $performance): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Performance $performance): bool
    {
        return false;
    }
}
