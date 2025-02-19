<?php

namespace App\Policies;

use App\Models\RequestOrder;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RequestOrderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('request-order: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, RequestOrder $requestOrder): bool
    {
        return $user->hasPermissionTo('request-order: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('request-order: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, RequestOrder $requestOrder): bool
    {
        return $user->hasPermissionTo('request-order: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RequestOrder $requestOrder): bool
    {
        return $user->hasPermissionTo('request-order: delete') ? true : false;
    }
}
