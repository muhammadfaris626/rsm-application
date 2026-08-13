<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiPaginationSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_search_is_preserved_in_pagination_links(): void
    {
        $matchingBranch = Branch::create([
            'branch_code' => 'MKS',
            'branch_name' => 'Makassar',
            'branch_address' => 'Jalan Makassar',
        ]);

        $otherBranch = Branch::create([
            'branch_code' => 'BPN',
            'branch_name' => 'Balikpapan',
            'branch_address' => 'Jalan Balikpapan',
        ]);

        foreach (range(1, 13) as $number) {
            Location::create([
                'branch_id' => $matchingBranch->id,
                'coordinates' => [
                    'address' => "Lokasi Makassar {$number}",
                    'latitude' => -5.1,
                    'longitude' => 119.4,
                ],
            ]);
        }

        Location::create([
            'branch_id' => $otherBranch->id,
            'coordinates' => [
                'address' => 'Lokasi Balikpapan',
                'latitude' => -1.2,
                'longitude' => 116.8,
            ],
        ]);

        $firstPage = $this->getJson('/api/locations?search=Makassar');

        $firstPage
            ->assertOk()
            ->assertJsonCount(12, 'data.data')
            ->assertJsonPath('data.meta.current_page', 1);

        $nextPageUrl = $firstPage->json('data.links.next');
        $this->assertNotNull($nextPageUrl);
        $this->assertStringContainsString('search=Makassar', $nextPageUrl);

        $this->getJson('/api/locations?search=Makassar&page=2')
            ->assertOk()
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.meta.current_page', 2)
            ->assertJsonPath('data.data.0.branch.name', 'Makassar');
    }
}
