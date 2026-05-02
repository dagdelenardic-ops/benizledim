<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CanonicalDomainRedirectTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function store_domain_requests_are_redirected_to_the_com_domain(): void
    {
        $response = $this->get('https://benizledim.store/ara?q=dark');

        $response->assertRedirect('https://benizledim.com/ara?q=dark');
        $this->assertSame(301, $response->getStatusCode());
    }

    #[Test]
    public function www_com_requests_are_redirected_to_the_naked_com_domain(): void
    {
        $response = $this->get('https://www.benizledim.com/yazilar');

        $response->assertRedirect('https://benizledim.com/yazilar');
        $this->assertSame(301, $response->getStatusCode());
    }

    #[Test]
    public function canonical_com_domain_serves_the_request_without_redirecting(): void
    {
        $response = $this->get('https://benizledim.com/');

        $response->assertOk();
    }
}
