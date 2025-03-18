<?php

namespace App\Policies;

use App\Models\InventoryPurchase;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InventoryPurchasePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('inventory-purchase: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, InventoryPurchase $inventoryPurchase): bool
    {
        return $user->hasPermissionTo('inventory-purchase: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('inventory-purchase: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, InventoryPurchase $inventoryPurchase): bool
    {
        return $user->hasPermissionTo('inventory-purchase: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, InventoryPurchase $inventoryPurchase): bool
    {
        return $user->hasPermissionTo('inventory-purchase: delete') ? true : false;
    }
}
