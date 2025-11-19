<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:500',
            'message' => 'required|string|max:5000',
        ]);

        // Log the contact form submission
        Log::info('Contact form submission', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
        ]);

        // TODO: Implement email sending logic
        // Example:
        // Mail::to('admin@coffeest.com')->send(new ContactFormMail($validated));

        // For now, just return success
        return response()->json([
            'message' => 'Thank you for contacting us! We will get back to you within 24 hours.',
            'data' => $validated,
        ], 201);
    }
}
