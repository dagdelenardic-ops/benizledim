<?php

namespace App\Support;

use Illuminate\Support\Str;

class WixTitleNormalizer
{
    public static function normalize(?string $value): string
    {
        if ($value === null) {
            return '';
        }

        $normalized = mb_strtolower(trim($value), 'UTF-8');

        if ($normalized === '') {
            return '';
        }

        $normalized = strtr($normalized, [
            'ç' => 'c',
            'ğ' => 'g',
            'ı' => 'i',
            'i̇' => 'i',
            'ö' => 'o',
            'ş' => 's',
            'ü' => 'u',
            'â' => 'a',
            'î' => 'i',
            'û' => 'u',
            'ê' => 'e',
            'ô' => 'o',
            '’' => "'",
            '‘' => "'",
            '“' => '"',
            '”' => '"',
            '–' => '-',
            '—' => '-',
            '―' => '-',
            '|' => ' ',
            '·' => ' ',
            '•' => ' ',
        ]);

        $normalized = Str::ascii($normalized);
        $normalized = preg_replace('/[^a-z0-9]+/u', ' ', $normalized) ?? $normalized;
        $normalized = preg_replace('/\s+/u', ' ', $normalized) ?? $normalized;

        return trim($normalized);
    }
}
