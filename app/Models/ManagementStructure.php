<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ManagementStructure extends Model
{
    use HasFactory;

    protected $fillable = ['employee_id', 'position_id', 'branch_id'];

    public function employee(): BelongsTo {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function position(): BelongsTo {
        return $this->belongsTo(Position::class, 'position_id');
    }

    public function branch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function updateManagementStructureHistory(): HasMany {
        return $this->hasMany(UpdateManagementStructureHistory::class);
    }

    public function sale(): HasMany {
        return $this->hasMany(Sale::class);
    }
}
