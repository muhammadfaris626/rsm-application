<?php

namespace App\Policies;

use App\Models\Mutation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MutationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('mutation: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Mutation $mutation): bool
    {
        return $user->hasPermissionTo('mutation: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('mutation: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Mutation $mutation): bool
    {
        return $user->hasPermissionTo('mutation: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Mutation $mutation): bool
    {
        return $user->hasPermissionTo('mutation: delete') ? true : false;
    }
}
