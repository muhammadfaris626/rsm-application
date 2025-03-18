<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Expenditure extends Model
{
    use HasFactory;

    protected $fillable = ['type_of_fee'];

    public function updateExpenditureHistory(): HasMany {
        return $this->hasMany(UpdateExpenditureHistory::class);
    }

    public function operationalCenter(): HasMany {
        return $this->hasMany(OperationalCenter::class);
    }

    public function operationalBranch(): HasMany {
        return $this->hasMany(OperationalBranch::class);
    }
}
