<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the old name column if it exists
            if (Schema::hasColumn('users', 'name')) {
                $table->dropColumn('name');
            }
            
            // Add new columns
            $table->string('first_name', 120)->after('id');
            $table->string('last_name', 120)->after('first_name');
            $table->string('address', 255)->nullable()->after('email');
            $table->string('phone', 50)->nullable()->after('address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Restore old structure
            $table->string('name')->after('id');
            
            // Drop new columns
            $table->dropColumn(['first_name', 'last_name', 'address', 'phone']);
        });
    }
};
