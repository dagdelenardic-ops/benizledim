<?php

namespace App\Http\Controllers;

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

    public function index(): Response
    {
        $questions = json_decode(file_get_contents(base_path('quiz_questions.json')), true);
        $characters = json_decode(file_get_contents(base_path('quiz_characters.json')), true);

        $subset = array_flip(self::QUESTION_SUBSET);
        $filtered = array_values(array_filter(
            $questions['questions'],
            fn ($q) => isset($subset[$q['id']])
        ));

        return Inertia::render('Quiz/Play', [
            'questions' => $filtered,
            'traits' => $questions['traits'],
            'meta' => $questions['meta'],
            'recommendation' => $questions['recommendation'] ?? [
                'distance_metric' => 'manhattan',
                'tie_breakers' => ['resilience', 'logic', 'integrity'],
                'top_n_suggestions' => 3,
            ],
            'characters' => $characters['characters'],
            'title' => 'Karakter Testi',
            'description' => 'Hangi dizi/film karakterine benziyorsun? Ben İzledim karakter testini çöz, sana uygun yapımları keşfet.',
            'canonicalUrl' => 'https://benizledim.com/quiz',
        ]);
    }
}
