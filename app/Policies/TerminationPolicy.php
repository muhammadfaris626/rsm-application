<?php

namespace App\Policies;

use App\Models\Termination;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TerminationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('termination: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Termination $termination): bool
    {
        return $user->hasPermissionTo('termination: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('termination: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Termination $termination): bool
    {
        return $user->hasPermissionTo('termination: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Termination $termination): bool
    {
        return $user->hasPermissionTo('termination: delete') ? true : false;
    }
}
