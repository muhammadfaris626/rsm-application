<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApprovalType extends Model
{
    use HasFactory;

    protected $fillable = ['approval_type_name'];

    public function updateApprovalTypeHistory(): HasMany {
        return $this->hasMany(UpdateApprovalTypeHistory::class);
    }
}
