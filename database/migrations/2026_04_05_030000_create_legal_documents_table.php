<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('legal_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type', 30);
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('jurisdiction')->default('Papua New Guinea');
            $table->string('source_url')->nullable();
            $table->string('storage_path')->nullable();
            $table->string('status', 20)->default('pending');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('year');
            $table->index('status');

            if (DB::getDriverName() === 'mysql') {
                $table->fullText('title');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legal_documents');
    }
};
