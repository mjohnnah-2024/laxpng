<?php

namespace App\Http\Requests\Admin;

use App\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::Admin;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:act,case_law,regulation,policy,guideline'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:'.date('Y')],
            'jurisdiction' => ['nullable', 'string', 'max:255'],
            'source_url' => ['nullable', 'url', 'max:2048'],
            'document' => ['required', 'file', 'mimes:pdf,txt', 'max:20480'],
        ];
    }
}
