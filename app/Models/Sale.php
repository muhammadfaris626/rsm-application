<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = ['branch_id', 'invoice_number', 'date', 'management_structure_id'];

    public function branch(): BelongsTo {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function managementStructure(): BelongsTo {
        return $this->belongsTo(ManagementStructure::class, 'management_structure_id');
    }

    public function listSale(): HasMany {
        return $this->hasMany(ListSale::class);
    }

    public function updateSaleHistory(): HasMany {
        return $this->hasMany(UpdateSaleHistory::class);
    }
}
