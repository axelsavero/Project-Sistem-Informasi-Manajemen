<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'ticket_number',
        'name',
        'email',
        'phone',
        'address',
        'category',
        'description',
        'image_path',
        'status',
        'admin_notes',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['image_url', 'category_label', 'status_label'];

    /**
     * Category labels.
     */
    const CATEGORY_LABELS = [
        'jalan_rusak' => 'Jalan Rusak',
        'sampah' => 'Sampah Menumpuk',
        'penerangan' => 'Penerangan Jalan Mati',
        'saluran_air' => 'Saluran Air Tersumbat',
        'fasilitas_umum' => 'Fasilitas Umum Rusak',
        'lainnya' => 'Lainnya',
    ];

    /**
     * Status labels.
     */
    const STATUS_LABELS = [
        'pending' => 'Menunggu',
        'in_progress' => 'Diproses',
        'completed' => 'Selesai',
        'rejected' => 'Ditolak',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($complaint) {
            if (empty($complaint->ticket_number)) {
                $complaint->ticket_number = self::generateTicketNumber();
            }
        });
    }

    /**
     * Get the user that owns the complaint.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the image URL accessor.
     */
    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        return null;
    }

    /**
     * Get the category label accessor.
     */
    public function getCategoryLabelAttribute()
    {
        return self::CATEGORY_LABELS[$this->category] ?? $this->category;
    }

    /**
     * Get the status label accessor.
     */
    public function getStatusLabelAttribute()
    {
        return self::STATUS_LABELS[$this->status] ?? $this->status;
    }

    /**
     * Scope a query to only include pending complaints.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include in-progress  complaints.
     */
    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    /**
     * Scope a query to only include completed complaints.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include rejected complaints.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Generate a unique ticket number.
     */
    public static function generateTicketNumber()
    {
        $date = now();
        $year = $date->format('y');
        $month = $date->format('m');
        $day = $date->format('d');
        $random = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));

        return "LP{$year}{$month}{$day}-{$random}";
    }
}
