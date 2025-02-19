<?php

namespace App\Policies;

use App\Models\BranchProduct;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BranchProductPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('branch-product: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BranchProduct $branchProduct): bool
    {
        return $user->hasPermissionTo('branch-product: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('branch-product: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BranchProduct $branchProduct): bool
    {
        return $user->hasPermissionTo('branch-product: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BranchProduct $branchProduct): bool
    {
        return $user->hasPermissionTo('branch-product: delete') ? true : false;
    }
}
