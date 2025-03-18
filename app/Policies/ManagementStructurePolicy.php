<?php

namespace App\Policies;

use App\Models\ManagementStructure;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ManagementStructurePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('management-structure: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ManagementStructure $managementStructure): bool
    {
        return $user->hasPermissionTo('management-structure: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('management-structure: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ManagementStructure $managementStructure): bool
    {
        return $user->hasPermissionTo('management-structure: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ManagementStructure $managementStructure): bool
    {
        return $user->hasPermissionTo('management-structure: delete') ? true : false;
    }
}
