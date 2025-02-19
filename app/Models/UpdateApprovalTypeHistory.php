<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdateApprovalTypeHistory extends Model
{
    use HasFactory;

    protected $fillable = ['approval_type_id', 'user_id'];

    public function approvalType(): BelongsTo {
        return $this->belongsTo(ApprovalType::class, 'approval_type_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
