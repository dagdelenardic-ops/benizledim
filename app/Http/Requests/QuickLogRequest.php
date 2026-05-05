<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuickLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccessCms() ?? false;
    }

    public function rules(): array
    {
        return [
            'tmdb_id' => ['nullable', 'integer', 'required_without:external_title'],
            'tmdb_type' => ['nullable', 'in:movie,tv'],
            'external_title' => ['nullable', 'string', 'max:255', 'required_without:tmdb_id'],
            'external_year' => ['nullable', 'integer', 'between:1880,2100'],
            'rating' => ['nullable', 'integer', 'between:1,10'],
            'mood_tags' => ['nullable', 'array', 'max:3'],
            'mood_tags.*' => ['string', 'max:30'],
            'note' => ['nullable', 'string', 'max:280'],
            'watched_on' => ['nullable', 'date', 'before_or_equal:today'],
            'status' => ['required', 'in:published,draft'],
            'cover_image' => ['nullable', 'url'],
        ];
    }
}