<?php

namespace App\Policies;

use App\Models\CenterStock;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CenterStockPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('center-stock: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CenterStock $centerStock): bool
    {
        return $user->hasPermissionTo('center-stock: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('center-stock: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CenterStock $centerStock): bool
    {
        return $user->hasPermissionTo('center-stock: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CenterStock $centerStock): bool
    {
        return $user->hasPermissionTo('center-stock: delete') ? true : false;
    }
}
