<?php

namespace App\Policies;

use App\Models\OperationalCenter;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OperationalCenterPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('operational-center: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, OperationalCenter $operationalCenter): bool
    {
        return $user->hasPermissionTo('operational-center: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('operational-center: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OperationalCenter $operationalCenter): bool
    {
        return $user->hasPermissionTo('operational-center: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OperationalCenter $operationalCenter): bool
    {
        return $user->hasPermissionTo('operational-center: delete') ? true : false;
    }
}
