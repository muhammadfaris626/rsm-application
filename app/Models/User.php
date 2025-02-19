<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isOnline() {
        return Cache::has('user-is-online' . $this->id);
    }

    public function updateBranchHistory(): HasMany {
        return $this->hasMany(UpdateBranchHistory::class);
    }

    public function updateEmployeeHistory(): HasMany {
        return $this->hasMany(UpdateEmployeeHistory::class);
    }

    public function updateProductCategoryHistory(): HasMany {
        return $this->hasMany(UpdateProductCategoryHistory::class);
    }

    public function updateProductHistory(): HasMany {
        return $this->hasMany(UpdateProductHistory::class);
    }

    public function updateExpenditureHistory(): HasMany {
        return $this->hasMany(UpdateExpenditureHistory::class);
    }

    public function operationalCenter(): HasMany {
        return $this->hasMany(OperationalCenter::class);
    }

    public function updateOperationalCenterHistory(): HasMany {
        return $this->hasMany(UpdateOperationalCenterHistory::class);
    }

    public function operationalBranch(): HasMany {
        return $this->hasMany(OperationalBranch::class);
    }

    public function updateOperationalBranchHistory(): HasMany {
        return $this->hasMany(UpdateOperationalBranchHistory::class);
    }

    public function updatePositionHistory(): HasMany {
        return $this->hasMany(UpdatePositionHistory::class);
    }

    public function updateSupplierHistory(): HasMany {
        return $this->hasMany(UpdateSupplierHistory::class);
    }

    public function updateManagementStructureHistory(): HasMany {
        return $this->hasMany(UpdateManagementStructureHistory::class);
    }

    public function updateInventoryPurchaseHistory(): HasMany {
        return $this->hasMany(UpdateInventoryPurchaseHistory::class);
    }

    public function updateRequestOrderHistory(): HasMany {
        return $this->hasMany(UpdateRequestOrderHistory::class);
    }

    public function requestOrderLog(): HasMany {
        return $this->hasMany(RequestOrderLog::class);
    }

    public function updateSaleHistory(): HasMany {
        return $this->hasMany(UpdateSaleHistory::class);
    }

    public function updateRequestReturnHistory(): HasMany {
        return $this->hasMany(UpdateRequestReturnHistory::class);
    }

    public function requestReturnLog(): HasMany {
        return $this->hasMany(RequestReturnLog::class);
    }
}
