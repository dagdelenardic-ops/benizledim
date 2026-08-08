<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * The quiz ships trait vectors for every character so scoring stays client
 * side, but the prose belongs to the one matched character and is fetched on
 * demand. Shipping all of it up front was 110 KB of the initial payload.
 */
class QuizPayloadTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['inertia.ssr.enabled' => false]);
    }

    #[Test]
    public function the_quiz_page_ships_scoring_fields_without_character_prose(): void
    {
        $this->get('/quiz')->assertOk()->assertInertia(function (Assert $page) {
            $page->component('Quiz/Play')->has('characters');

            $characters = $page->toArray()['props']['characters'];
            $this->assertNotEmpty($characters);

            foreach ($characters as $character) {
                $this->assertArrayHasKey('traits', $character);
                $this->assertArrayHasKey('name', $character);
                $this->assertArrayNotHasKey('depth_tr', $character);
                $this->assertArrayNotHasKey('result_blurb_tr', $character);
                $this->assertArrayNotHasKey('career_dna_tr', $character);
            }
        });
    }

    #[Test]
    public function a_single_character_can_be_fetched_with_its_full_prose(): void
    {
        $id = $this->get('/quiz')->viewData('page')['props']['characters'][0]['id'];

        $response = $this->getJson('/quiz/karakter/'.$id);

        $response->assertOk();
        $response->assertJsonPath('id', $id);
        $this->assertNotEmpty($response->json('result_blurb_tr'));
    }

    #[Test]
    public function an_unknown_character_is_a_404(): void
    {
        $this->getJson('/quiz/karakter/boyle-bir-karakter-yok')->assertNotFound();
    }
}
