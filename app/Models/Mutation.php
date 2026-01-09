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
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function fromBranch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'from_branch_id');
    }

    public function toBranch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'to_branch_id');
    }

    public function approvedBy(): BelongsTo {
        return $this->belongsTo(Employee::class, 'approved_by');
    }
}
