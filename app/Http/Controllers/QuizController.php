<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    /**
     * Optimal 15-question subset selected by greedy info-gain analysis.
     * Preserves baseline (25Q) accuracy while cutting time ~40%.
     * See scripts/quiz_optimize2.py.
     */
    private const QUESTION_SUBSET = [
        'q02', 'q03', 'q05', 'q06', 'q07', 'q08', 'q09', 'q10',
        'q14', 'q15', 'q17', 'q20', 'q21', 'q22', 'q23',
    ];

    /**
     * Fields the browser needs for all 60 characters: trait vectors to score
     * against, plus the labels shown in the start marquee, the distribution
     * chart and the "opposite" card. Every other field is prose that only the
     * one matched character ever displays, so it is fetched on demand — it was
     * 110 KB of the initial page payload.
     *
     * @var list<string>
     */
    private const SCORING_FIELDS = [
        'id', 'name', 'work', 'year', 'symbol',
        'mbti_hint', 'tags', 'traits', 'result_archetype_tr',
    ];

    public function index(): Response
    {
        $questions = $this->questions();

        $subset = array_flip(self::QUESTION_SUBSET);
        $filtered = array_values(array_filter(
            $questions['questions'],
            fn ($q) => isset($subset[$q['id']])
        ));

        $scoringFields = array_flip(self::SCORING_FIELDS);
        $characters = array_map(
            fn (array $character) => array_intersect_key($character, $scoringFields),
            $this->characters()
        );

        return Inertia::render('Quiz/Play', [
            'questions' => $filtered,
            'traits' => $questions['traits'],
            'meta' => $questions['meta'],
            'recommendation' => $questions['recommendation'] ?? [
                'distance_metric' => 'manhattan',
                'tie_breakers' => ['resilience', 'logic', 'integrity'],
                'top_n_suggestions' => 3,
            ],
            'characters' => $characters,
            'title' => 'Hangi Film Karakterisin? — Quiz',
            'description' => 'Hangi dizi/film karakterine benziyorsun? Ben İzledim karakter testini çöz, sana uygun yapımları keşfet.',
            'canonicalUrl' => 'https://benizledim.com/quiz',
            'ogImage' => '/images/quiz-og.png',
        ]);
    }

    /**
     * Full record for a single character, fetched once the quiz has a winner.
     */
    public function character(string $character): JsonResponse
    {
        foreach ($this->characters() as $candidate) {
            if (($candidate['id'] ?? null) === $character) {
                return response()->json($candidate)
                    ->setPublic()
                    ->setMaxAge(3600)
                    ->setSharedMaxAge(86400);
            }
        }

        return response()->json(['error' => 'not found'], 404);
    }

    /**
     * @return array<string, mixed>
     */
    private function questions(): array
    {
        return json_decode(file_get_contents(base_path('quiz_questions.json')), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function characters(): array
    {
        $data = json_decode(file_get_contents(base_path('quiz_characters.json')), true, 512, JSON_THROW_ON_ERROR);

        return $data['characters'];
    }
}
