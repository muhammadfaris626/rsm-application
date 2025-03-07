<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mutation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'from_branch_id', 'to_branch_id', 'transfer_date',
        'reason', 'approved_by', 'status'
    ];

    public function employee(): BelongsTo {
        return $this->belongsTo(Employee::class, ['employee_id', 'approved_by']);
    }

    public function branch(): BelongsTo {
        return $this->belongsTo(Branch::class, ['from_branch_id', 'to_branch_id']);
    }
}
