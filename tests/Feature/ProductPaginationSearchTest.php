<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductPaginationSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_search_is_preserved_when_opening_the_next_page(): void
    {
        $user = User::factory()->create();
        Gate::before(fn (User $user, string $ability): bool => true);

        $category = ProductCategory::create([
            'product_category_code' => 'ELC',
            'product_category_name' => 'Elektronik',
        ]);

        foreach (range(1, 13) as $number) {
            Product::create([
                'product_category_id' => $category->id,
                'product_name' => sprintf('Kabel %02d', $number),
            ]);
        }

        Product::create([
            'product_category_id' => $category->id,
            'product_name' => 'Adaptor',
        ]);

        $this->actingAs($user)
            ->get(route('products.index', ['search' => 'Kabel']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('search', 'Kabel')
                ->has('fetchData.data', 12)
                ->where('fetchData.meta.links.2.url', fn (?string $url): bool =>
                    $url !== null && str_contains($url, 'search=Kabel')
                ));

        $this->actingAs($user)
            ->get(route('products.index', ['search' => 'Kabel', 'page' => 2]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('fetchData.data', 1)
                ->where('fetchData.data.0.product_name', fn (string $name): bool =>
                    str_starts_with($name, 'Kabel ')
                )
                ->where('fetchData.meta.current_page', 2));
    }
}
