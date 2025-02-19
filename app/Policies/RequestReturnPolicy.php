<?php

namespace App\Policies;

use App\Models\RequestReturn;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RequestReturnPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('request-return: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, RequestReturn $requestReturn): bool
    {
        return $user->hasPermissionTo('request-return: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('request-return: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, RequestReturn $requestReturn): bool
    {
        return $user->hasPermissionTo('request-return: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RequestReturn $requestReturn): bool
    {
        return $user->hasPermissionTo('request-return: delete') ? true : false;
    }
}
