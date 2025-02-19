<?php

namespace App\Policies;

use App\Models\ApprovalType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ApprovalTypePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('approval-type: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ApprovalType $approvalType): bool
    {
        return $user->hasPermissionTo('approval-type: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('approval-type: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ApprovalType $approvalType): bool
    {
        return $user->hasPermissionTo('approval-type: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ApprovalType $approvalType): bool
    {
        return $user->hasPermissionTo('approval-type: delete') ? true : false;
    }
}
