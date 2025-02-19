<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = ['employee_number', 'name', 'address', 'place_of_birth', 'date_of_birth', 'phone', 'branch_id', 'status'];

    public function branch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function updateEmployeeHistory(): HasMany {
        return $this->hasMany(UpdateEmployeeHistory::class);
    }

    public function managementStructure(): HasMany {
        return $this->hasMany(ManagementStructure::class);
    }
}
