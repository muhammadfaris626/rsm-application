<?php

namespace App\Policies;

use App\Models\Expenditure;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ExpenditurePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('expenditure: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Expenditure $expenditure): bool
    {
        return $user->hasPermissionTo('expenditure: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('expenditure: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Expenditure $expenditure): bool
    {
        return $user->hasPermissionTo('expenditure: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Expenditure $expenditure): bool
    {
        return $user->hasPermissionTo('expenditure: delete') ? true : false;
    }
}
