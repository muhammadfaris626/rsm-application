<?php

namespace App\Policies;

use App\Models\ReportBranch;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReportBranchPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('report-branch: menu') ? true : false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ReportBranch $reportBranch): bool
    {
        return $user->hasPermissionTo('report-branch: read') ? true : false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('report-branch: create') ? true : false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ReportBranch $reportBranch): bool
    {
        return $user->hasPermissionTo('report-branch: update') ? true : false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ReportBranch $reportBranch): bool
    {
        return $user->hasPermissionTo('report-branch: delete') ? true : false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ReportBranch $reportBranch): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ReportBranch $reportBranch): bool
    {
        return false;
    }
}
