<?php

namespace App\Services;

class SentimentAnalyzer
{
    protected array $lexicon = [];

    public function __construct()
    {
        $lexiconPath = storage_path('app/sentiment/turkish_lexicon.php');

        if (file_exists($lexiconPath)) {
            $this->lexicon = require $lexiconPath;
        }
    }

    /**
     * Analyze the sentiment of a Turkish text.
     *
     * @return array{score: float, label: string, word_count: int, sentiment_words: int}
     */
    public function analyze(string $text): array
    {
        $words = $this->tokenize($text);
        $wordCount = count($words);

        $totalScore = 0.0;
        $sentimentWords = 0;

        foreach ($words as $word) {
            if (isset($this->lexicon[$word])) {
                $totalScore += (float) $this->lexicon[$word];
                $sentimentWords++;
            }
        }

        // Weighted average: normalize by number of sentiment words found
        $score = $sentimentWords > 0
            ? round($totalScore / $sentimentWords, 4)
            : 0.0;

        // Clamp score to [-1, 1]
        $score = max(-1.0, min(1.0, $score));

        return [
            'score' => $score,
            'label' => $this->scoreToLabel($score, $sentimentWords),
            'word_count' => $wordCount,
            'sentiment_words' => $sentimentWords,
        ];
    }

    /**
     * Tokenize Turkish text into lowercase words, handling UTF-8.
     */
    protected function tokenize(string $text): array
    {
        // Lowercase with Turkish-aware mb_strtolower
        $text = mb_strtolower($text, 'UTF-8');

        // Remove punctuation but keep Turkish characters
        $text = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $text);

        // Split on whitespace
        $words = preg_split('/\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY);

        return $words ?: [];
    }

    /**
     * Convert a numeric score to a human-readable Turkish label.
     */
    protected function scoreToLabel(float $score, int $sentimentWords): string
    {
        // If no sentiment words were found, it's neutral
        if ($sentimentWords === 0) {
            return 'notr';
        }

        if ($score >= 0.3) {
            return 'pozitif';
        }

        if ($score <= -0.3) {
            return 'negatif';
        }

        return 'notr';
    }
}
