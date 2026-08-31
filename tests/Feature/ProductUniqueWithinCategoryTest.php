<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class ProductUniqueWithinCategoryTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private ProductCategory $categoryA;
    private ProductCategory $categoryB;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Gate::before(fn (User $user, string $ability): bool => true);

        $this->categoryA = ProductCategory::create([
            'product_category_code' => 'CAT-A',
            'product_category_name' => 'Kategori A',
        ]);
        $this->categoryB = ProductCategory::create([
            'product_category_code' => 'CAT-B',
            'product_category_name' => 'Kategori B',
        ]);
    }

    public function test_same_product_name_is_rejected_inside_the_same_category(): void
    {
        Product::create([
            'product_category_id' => $this->categoryA->id,
            'product_name' => 'Barang A',
        ]);

        $response = $this->actingAs($this->user)
            ->from(route('products.index'))
            ->post(route('products.store'), [
                'product_category_id' => ['id' => $this->categoryA->id],
                'product_name' => '  barang   a  ',
            ]);

        $response->assertRedirect(route('products.index'))
            ->assertSessionHasErrors('product_name');
        $this->assertSame(1, Product::where('product_category_id', $this->categoryA->id)->count());
    }

    public function test_same_product_name_is_allowed_in_a_different_category(): void
    {
        Product::create([
            'product_category_id' => $this->categoryA->id,
            'product_name' => 'Barang A',
        ]);

        $this->actingAs($this->user)->post(route('products.store'), [
            'product_category_id' => ['id' => $this->categoryB->id],
            'product_name' => 'Barang A',
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('products', [
            'product_category_id' => $this->categoryB->id,
            'product_name' => 'Barang A',
        ]);
    }

    public function test_update_ignores_itself_but_rejects_another_product_in_the_category(): void
    {
        $productA = Product::create([
            'product_category_id' => $this->categoryA->id,
            'product_name' => 'Barang A',
        ]);
        $productB = Product::create([
            'product_category_id' => $this->categoryA->id,
            'product_name' => 'Barang B',
        ]);

        $this->actingAs($this->user)->put(route('products.update', $productA), [
            'product_category_id' => ['id' => $this->categoryA->id],
            'product_name' => ' Barang   A ',
        ])->assertSessionHasNoErrors();
        $this->assertSame('Barang A', $productA->fresh()->product_name);

        $response = $this->actingAs($this->user)
            ->from(route('products.index'))
            ->put(route('products.update', $productB), [
                'product_category_id' => ['id' => $this->categoryA->id],
                'product_name' => 'BARANG A',
            ]);

        $response->assertRedirect(route('products.index'))
            ->assertSessionHasErrors('product_name');
        $this->assertSame('Barang B', $productB->fresh()->product_name);
    }
}
