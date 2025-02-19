<?php

namespace App\Policies;

use App\Models\OperationalBranch;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OperationalBranchPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('operational-branch: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, OperationalBranch $operationalBranch): bool
    {
        return $user->hasPermissionTo('operational-branch: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('operational-branch: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OperationalBranch $operationalBranch): bool
    {
        return $user->hasPermissionTo('operational-branch: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OperationalBranch $operationalBranch): bool
    {
        return $user->hasPermissionTo('operational-branch: delete') ? true : false;
    }
}
