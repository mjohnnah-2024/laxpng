<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'category', 'description', 'content', 'fields', 'is_active'])]
class LegalTemplate extends Model
{
    /** @use HasFactory<\Database\Factories\LegalTemplateFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fields' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'is_active' => true,
    ];
}
