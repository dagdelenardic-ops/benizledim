<?php

namespace App\Services;

use Google\Auth\CredentialsLoader;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VertexAiSearchService
{
    private string $projectId;
    private string $location;
    private string $dataStoreId;
    private string $servingConfigId;

    public function __construct()
    {
        $this->projectId = (string) config('services.gcp.project_id');
        $this->location = (string) config('services.gcp.location', 'global');
        $this->dataStoreId = (string) config('services.gcp.datastore_id');
        $this->servingConfigId = (string) config('services.gcp.serving_config_id', 'default_serving_config');
    }

    public function search(string $query, int $pageSize = 5): array
    {
        if ($this->projectId === '' || $this->dataStoreId === '') {
            Log::warning('Vertex AI Search not configured (project_id or datastore_id missing).');
            return [];
        }

        $token = $this->accessToken();
        if ($token === null) {
            return [];
        }

        $url = "https://discoveryengine.googleapis.com/v1alpha/projects/{$this->projectId}/locations/{$this->location}/collections/default_collection/dataStores/{$this->dataStoreId}/servingConfigs/{$this->servingConfigId}:search";

        try {
            $response = Http::timeout(10)
                ->withToken($token)
                ->post($url, [
                    'query' => $query,
                    'pageSize' => $pageSize,
                    'queryExpansionSpec' => ['condition' => 'AUTO'],
                    'spellCorrectionSpec' => ['mode' => 'AUTO'],
                ]);

            if (!$response->successful()) {
                Log::error('Vertex AI Search API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return [];
            }

            return $this->parseSearchResults($response->json());
        } catch (\Throwable $e) {
            Log::error('Vertex AI Search connection error', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Ask a grounded question. Returns ['answer' => string, 'citations' => [['id','title','slug',...], ...]]
     * Uses Discovery Engine :answer endpoint (Generative Responses must be enabled on the app).
     */
    public function answer(string $question, ?string $session = null): array
    {
        if ($this->projectId === '' || $this->dataStoreId === '') {
            return ['answer' => '', 'citations' => []];
        }

        $token = $this->accessToken();
        if ($token === null) {
            return ['answer' => '', 'citations' => []];
        }

        $url = "https://discoveryengine.googleapis.com/v1alpha/projects/{$this->projectId}/locations/{$this->location}/collections/default_collection/dataStores/{$this->dataStoreId}/servingConfigs/{$this->servingConfigId}:answer";

        $payload = [
            'query' => ['text' => $question],
            'answerGenerationSpec' => [
                'ignoreAdversarialQuery' => true,
                'ignoreNonAnswerSeekingQuery' => false,
                'includeCitations' => true,
                'modelSpec' => ['modelVersion' => 'stable'],
                'promptSpec' => [
                    'preamble' => 'Sen Benizledim film/dizi/belgesel platformunun yardımcısısın. Sadece sağlanan yazılara dayanarak Türkçe, samimi ve net cevap ver. Bilgi yoksa "Bu konuda henüz yazımız yok" de.',
                ],
            ],
        ];

        if ($session !== null && $session !== '') {
            $payload['session'] = $session;
        }

        try {
            $response = Http::timeout(30)
                ->withToken($token)
                ->post($url, $payload);

            if (!$response->successful()) {
                Log::error('Vertex AI Answer API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return ['answer' => '', 'citations' => []];
            }

            return $this->parseAnswer($response->json());
        } catch (\Throwable $e) {
            Log::error('Vertex AI Answer error', ['error' => $e->getMessage()]);
            return ['answer' => '', 'citations' => []];
        }
    }

    /**
     * Upsert documents into the data store via inline source.
     * Each document must be ['id' => string, 'structData' => array].
     * INCREMENTAL mode = upsert (no full replace).
     */
    public function importDocuments(array $documents): bool
    {
        if ($this->projectId === '' || $this->dataStoreId === '' || empty($documents)) {
            return false;
        }

        $token = $this->accessToken();
        if ($token === null) {
            return false;
        }

        $url = "https://discoveryengine.googleapis.com/v1alpha/projects/{$this->projectId}/locations/{$this->location}/collections/default_collection/dataStores/{$this->dataStoreId}/branches/default_branch/documents:import";

        try {
            $response = Http::timeout(30)
                ->withToken($token)
                ->post($url, [
                    'inlineSource' => ['documents' => array_values($documents)],
                    'reconciliationMode' => 'INCREMENTAL',
                ]);

            if (!$response->successful()) {
                Log::error('Vertex AI import error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return false;
            }
            return true;
        } catch (\Throwable $e) {
            Log::error('Vertex AI import exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function deleteDocument(string|int $id): bool
    {
        if ($this->projectId === '' || $this->dataStoreId === '') {
            return false;
        }
        $token = $this->accessToken();
        if ($token === null) {
            return false;
        }

        $url = "https://discoveryengine.googleapis.com/v1alpha/projects/{$this->projectId}/locations/{$this->location}/collections/default_collection/dataStores/{$this->dataStoreId}/branches/default_branch/documents/" . rawurlencode((string) $id);

        try {
            $response = Http::timeout(10)
                ->withToken($token)
                ->delete($url);
            return $response->successful() || $response->status() === 404;
        } catch (\Throwable $e) {
            Log::warning('Vertex AI delete exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Autocomplete suggestions for a partial query.
     */
    public function complete(string $partial, int $max = 6): array
    {
        if ($this->projectId === '' || $this->dataStoreId === '' || trim($partial) === '') {
            return [];
        }

        $token = $this->accessToken();
        if ($token === null) {
            return [];
        }

        $url = "https://discoveryengine.googleapis.com/v1alpha/projects/{$this->projectId}/locations/{$this->location}/collections/default_collection/dataStores/{$this->dataStoreId}:completeQuery";

        try {
            $response = Http::timeout(5)
                ->withToken($token)
                ->get($url, [
                    'query' => $partial,
                    'queryModel' => 'document-completable',
                ]);

            if (!$response->successful()) {
                return [];
            }

            $suggestions = collect($response->json()['querySuggestions'] ?? [])
                ->pluck('suggestion')
                ->filter()
                ->unique()
                ->take($max)
                ->values()
                ->all();

            return $suggestions;
        } catch (\Throwable $e) {
            Log::warning('Vertex AI Complete error', ['error' => $e->getMessage()]);
            return [];
        }
    }

    private function parseAnswer(array $data): array
    {
        $answer = $data['answer'] ?? [];
        $text = $answer['answerText'] ?? '';

        $citations = [];
        $seen = [];
        foreach (($answer['references'] ?? []) as $ref) {
            $info = $ref['structuredDocumentInfo']
                ?? $ref['chunkInfo']['documentMetadata']
                ?? $ref['unstructuredDocumentInfo']
                ?? [];
            $struct = $info['structData'] ?? [];
            $id = $struct['id'] ?? null;
            if ($id === null && !empty($info['document'])) {
                $id = basename((string) $info['document']);
            }
            if ($id === null) {
                continue;
            }
            $key = (string) $id;
            if (isset($seen[$key])) {
                continue;
            }
            $seen[$key] = true;
            $citations[] = [
                'id' => $key,
                'title' => $struct['title'] ?? $info['title'] ?? null,
                'slug' => $struct['slug'] ?? null,
                'excerpt' => $struct['excerpt'] ?? null,
            ];
        }

        return [
            'answer' => $text,
            'citations' => $citations,
            'session' => $data['session']['name'] ?? null,
        ];
    }

    private function accessToken(): ?string
    {
        $cached = Cache::get('vertex_ai_search_token');
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }

        try {
            $path = config('services.gcp.credentials_path') ?: env('GOOGLE_APPLICATION_CREDENTIALS');
            if (!$path || !file_exists($path)) {
                Log::error('Vertex AI credentials file missing', ['path' => (string) $path]);
                return null;
            }

            $json = json_decode((string) file_get_contents($path), true);
            if (!is_array($json)) {
                Log::error('Vertex AI credentials JSON invalid', ['path' => $path]);
                return null;
            }

            $creds = CredentialsLoader::makeCredentials(
                'https://www.googleapis.com/auth/cloud-platform',
                $json
            );
            $token = $creds->fetchAuthToken();
            $accessToken = $token['access_token'] ?? null;

            if ($accessToken) {
                Cache::put('vertex_ai_search_token', $accessToken, now()->addMinutes(50));
            }
            return $accessToken;
        } catch (\Throwable $e) {
            Log::error('Vertex AI token fetch failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    private function parseSearchResults(array $data): array
    {
        $results = [];
        foreach (($data['results'] ?? []) as $item) {
            $document = $item['document'] ?? [];
            $structData = $document['structData'] ?? [];
            if (empty($structData)) {
                continue;
            }

            $results[] = [
                'id' => $structData['id'] ?? null,
                'title' => $structData['title'] ?? 'Başlıksız',
                'slug' => $structData['slug'] ?? '',
                'excerpt' => $structData['excerpt'] ?? '',
                'published_at' => $structData['published_at'] ?? null,
                'categories' => $structData['categories'] ?? [],
                'mood_tags' => $structData['mood_tags'] ?? [],
                'duration_category' => $structData['duration_category'] ?? null,
                'intensity_level' => $structData['intensity_level'] ?? null,
                'relevance_score' => $item['relevanceScore'] ?? null,
            ];
        }

        return $results;
    }
}
