<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdateOperationalBranchHistory extends Model
{
    use HasFactory;

    protected $fillable = ['op_branch_id', 'user_id'];

    public function operationalBranch(): BelongsTo {
        return $this->belongsTo(OperationalBranch::class, 'op_branch_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
