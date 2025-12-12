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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('ticket_number', 50)->unique();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 20);
            $table->text('address');
            $table->enum('category', [
                'jalan_rusak',
                'sampah',
                'penerangan',
                'saluran_air',
                'fasilitas_umum',
                'lainnya'
            ]);
            $table->text('description');
            $table->string('image_path')->nullable();
            $table->enum('status', [
                'pending',
                'in_progress',
                'completed',
                'rejected'
            ])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index('ticket_number');
            $table->index('status');
            $table->index('category');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
