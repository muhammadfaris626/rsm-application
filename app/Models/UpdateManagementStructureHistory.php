<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UpdateManagementStructureHistory extends Model
{
    use HasFactory;

    protected $fillable = ['management_structure_id', 'user_id'];

    public function managementStructure(): BelongsTo {
        return $this->belongsTo(ManagementStructure::class, 'management_structure_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
