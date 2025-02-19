<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as CustomPermission;

class Permission extends CustomPermission
{
    use HasFactory;
}
