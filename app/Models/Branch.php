<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = ['branch_code', 'branch_name', 'branch_address', 'description', 'status'];

    public function updateBranchHistory(): HasMany {
        return $this->hasMany(UpdateBranchHistory::class);
    }

    public function operationalBranch(): HasMany {
        return $this->hasMany(OperationalBranch::class);
    }

    public function managementStructure(): HasMany {
        return $this->hasMany(ManagementStructure::class);
    }

    public function requestOrder(): HasMany {
        return $this->hasMany(RequestOrder::class);
    }

    public function branchProduct(): HasMany {
        return $this->hasMany(BranchProduct::class);
    }

    public function sale(): HasMany {
        return $this->hasMany(Sale::class);
    }

    public function requestReturn(): HasMany {
        return $this->hasMany(RequestReturn::class);
    }
}
