<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OperationalBranch extends Model
{
    use HasFactory;

    protected $fillable = ['branch_id', 'date', 'expenditure_id', 'total_cost', 'description', 'user_id'];

    public function branch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function expenditure(): BelongsTo {
        return $this->belongsTo(Expenditure::class, 'expenditure_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function updateOperationalBranchHistory(): HasMany {
        return $this->hasMany(UpdateOperationalBranchHistory::class);
    }
}
