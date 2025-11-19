<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get cart count
     */
    public function count()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        
        if (!$cart) {
            return response()->json(['count' => 0]);
        }
        
        $count = CartItem::where('cart_id', $cart->id)->sum('quantity');
        
        return response()->json(['count' => $count]);
    }

    /**
     * Get cart items
     */
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        
        if (!$cart) {
            return response()->json(['items' => []]);
        }
        
        $items = CartItem::where('cart_id', $cart->id)
            ->with('product')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product->name ?? 'Unknown Product',
                    'description' => $item->product->description ?? '',
                    'image_url' => $item->product->image_url ?? null,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                ];
            });
        
        return response()->json(['items' => $items]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        
        // Get product to ensure it exists and get its price
        $product = \App\Models\Product::findOrFail($request->product_id);
        
        // Get or create cart
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['user_id' => $user->id]
        );
        
        // Check if item already exists
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();
        
        if ($cartItem) {
            // Update quantity
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Create new cart item with product price
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $product->price,
            ]);
        }
        
        return response()->json([
            'message' => 'Item added to cart',
            'item' => $cartItem,
        ], 201);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        
        $cartItem = CartItem::where('id', $id)
            ->where('cart_id', $cart->id)
            ->first();
        
        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }
        
        $cartItem->quantity = $request->quantity;
        $cartItem->save();
        
        return response()->json([
            'message' => 'Cart item updated',
            'item' => $cartItem,
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        
        $cartItem = CartItem::where('id', $id)
            ->where('cart_id', $cart->id)
            ->first();
        
        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }
        
        $cartItem->delete();
        
        return response()->json(['message' => 'Item removed from cart']);
    }

    /**
     * Clear cart
     */
    public function clear()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        
        if ($cart) {
            CartItem::where('cart_id', $cart->id)->delete();
        }
        
        return response()->json(['message' => 'Cart cleared']);
    }
}
