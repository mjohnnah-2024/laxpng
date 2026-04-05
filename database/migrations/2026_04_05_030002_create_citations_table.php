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
        Schema::create('citations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('legal_document_id')->constrained()->cascadeOnDelete();
            $table->foreignId('document_chunk_id')->nullable()->constrained()->nullOnDelete();
            $table->string('case_name')->nullable();
            $table->string('act_name')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('section')->nullable();
            $table->string('url')->nullable();
            $table->timestamps();

            $table->index('case_name');
            $table->index('act_name');
            $table->index('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citations');
    }
};
