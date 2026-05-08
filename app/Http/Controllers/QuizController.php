<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function index(): Response
    {
        $questions = json_decode(file_get_contents(base_path('quiz_questions.json')), true);
        $characters = json_decode(file_get_contents(base_path('quiz_characters.json')), true);

        return Inertia::render('Quiz/Play', [
            'questions' => $questions['questions'],
            'traits' => $questions['traits'],
            'meta' => $questions['meta'],
            'recommendation' => $questions['recommendation'] ?? [
                'distance_metric' => 'manhattan',
                'tie_breakers' => ['resilience', 'logic', 'integrity'],
                'top_n_suggestions' => 3,
            ],
            'characters' => $characters['characters'],
        ]);
    }
}
