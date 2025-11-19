<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Espresso',
                'description' => 'Rich and bold espresso shot',
                'price' => 3.50,
                'category' => 'Hot Coffee',
                'in_stock' => true,
            ],
            [
                'name' => 'Cappuccino',
                'description' => 'Espresso with steamed milk and foam',
                'price' => 4.50,
                'category' => 'Hot Coffee',
                'in_stock' => true,
            ],
            [
                'name' => 'Latte',
                'description' => 'Smooth espresso with steamed milk',
                'price' => 4.75,
                'category' => 'Hot Coffee',
                'in_stock' => true,
            ],
            [
                'name' => 'Americano',
                'description' => 'Espresso with hot water',
                'price' => 3.75,
                'category' => 'Hot Coffee',
                'in_stock' => true,
            ],
            [
                'name' => 'Iced Coffee',
                'description' => 'Cold brewed coffee over ice',
                'price' => 3.75,
                'category' => 'Cold Coffee',
                'in_stock' => true,
            ],
            [
                'name' => 'Cold Brew',
                'description' => 'Smooth cold-steeped coffee',
                'price' => 4.25,
                'category' => 'Cold Coffee',
                'in_stock' => true,
            ],
            [
                'name' => 'Iced Latte',
                'description' => 'Espresso with cold milk over ice',
                'price' => 5.00,
                'category' => 'Cold Coffee',
                'in_stock' => true,
            ],
            [
                'name' => 'Mocha',
                'description' => 'Espresso with chocolate and steamed milk',
                'price' => 5.25,
                'category' => 'Specialty',
                'in_stock' => true,
            ],
            [
                'name' => 'Caramel Macchiato',
                'description' => 'Espresso with vanilla, caramel, and milk',
                'price' => 5.50,
                'category' => 'Specialty',
                'in_stock' => true,
            ],
            [
                'name' => 'Flat White',
                'description' => 'Double espresso with microfoam milk',
                'price' => 4.75,
                'category' => 'Specialty',
                'in_stock' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
