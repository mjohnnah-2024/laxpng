<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['legal_document_id', 'document_chunk_id', 'case_name', 'act_name', 'year', 'section', 'url'])]
class Citation extends Model
{
    /** @use HasFactory<\Database\Factories\CitationFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<LegalDocument, $this>
     */
    public function legalDocument(): BelongsTo
    {
        return $this->belongsTo(LegalDocument::class);
    }

    /**
     * @return BelongsTo<DocumentChunk, $this>
     */
    public function documentChunk(): BelongsTo
    {
        return $this->belongsTo(DocumentChunk::class);
    }
}
