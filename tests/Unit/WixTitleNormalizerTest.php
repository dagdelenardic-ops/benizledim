<?php

namespace Tests\Unit;

use App\Support\WixTitleNormalizer;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class WixTitleNormalizerTest extends TestCase
{
    #[DataProvider('titleVariants')]
    public function test_it_normalizes_title_variants(string $input, string $expected): void
    {
        $this->assertSame($expected, WixTitleNormalizer::normalize($input));
    }

    /**
     * @return array<string, array{0: string, 1: string}>
     */
    public static function titleVariants(): array
    {
        return [
            'turkish characters' => [
                'İçgüdülerimizle Neden Barışık Değiliz?',
                'icgudulerimizle neden barisik degiliz',
            ],
            'typographic punctuation' => [
                'Fantastic Four: First Steps – Is Marvel Back?',
                'fantastic four first steps is marvel back',
            ],
            'extra spacing and pipes' => [
                'Rear Window (Alfred Hitchcock)| Bir   Kadın Ne Kadar Güçlüdür?',
                'rear window alfred hitchcock bir kadin ne kadar gucludur',
            ],
            'accented letters' => [
                'Hikâyenin Peşinde: Tuna Yüksel ile Yazarlık, Dil ve Sinema Üzerine',
                'hikayenin pesinde tuna yuksel ile yazarlik dil ve sinema uzerine',
            ],
        ];
    }
}
