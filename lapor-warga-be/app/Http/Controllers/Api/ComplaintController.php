<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreComplaintRequest;
use App\Http\Requests\UpdateComplaintRequest;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ComplaintController extends Controller
{
    /**
     * Display a listing of complaints (admin only).
     */
    public function index(Request $request)
    {
        $query = Complaint::with('user');

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by category if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Search by ticket number, name, or address
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $complaints = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($complaints);
    }

    /**
     * Store a newly created complaint.
     */
    public function store(StoreComplaintRequest $request)
    {
        $data = $request->validated();

        // Handle image upload if present
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('complaints', 'public');
            $data['image_path'] = $imagePath;
        }

        // If user is authenticated, associate the complaint
        if ($request->user()) {
            $data['user_id'] = $request->user()->id;
        }

        $complaint = Complaint::create($data);

        return response()->json([
            'message' => 'Laporan berhasil dibuat',
            'complaint' => $complaint->load('user'),
        ], 201);
    }

    /**
     * Display the specified complaint.
     */
    public function show($id)
    {
        $complaint = Complaint::with('user')->findOrFail($id);

        return response()->json($complaint);
    }

    /**
     * Update the specified complaint (admin only).
     */
    public function update(UpdateComplaintRequest $request, $id)
    {
        $complaint = Complaint::findOrFail($id);

        $data = $request->validated();
        $complaint->update($data);

        return response()->json([
            'message' => 'Laporan berhasil diperbarui',
            'complaint' => $complaint->load('user'),
        ]);
    }

    /**
     * Remove the specified complaint (admin only).
     */
    public function destroy($id)
    {
        $complaint = Complaint::findOrFail($id);

        // Delete image if exists
        if ($complaint->image_path) {
            Storage::disk('public')->delete($complaint->image_path);
        }

        $complaint->delete();

        return response()->json([
            'message' => 'Laporan berhasil dihapus',
        ]);
    }

    /**
     * Find complaint by ticket number (public).
     */
    public function findByTicket($ticketNumber)
    {
        $complaint = Complaint::with('user')
            ->where('ticket_number', $ticketNumber)
            ->first();

        if (!$complaint) {
            return response()->json([
                'message' => 'Laporan tidak ditemukan',
            ], 404);
        }

        return response()->json($complaint);
    }

    /**
     * Get complaint statistics (admin only).
     */
    public function stats()
    {
        $stats = [
            'total' => Complaint::count(),
            'pending' => Complaint::pending()->count(),
            'in_progress' => Complaint::inProgress()->count(),
            'completed' => Complaint::completed()->count(),
            'rejected' => Complaint::rejected()->count(),
        ];

        // Statistics by category
        $byCategory = Complaint::selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->get()
            ->pluck('count', 'category');

        return response()->json([
            'stats' => $stats,
            'by_category' => $byCategory,
        ]);
    }
}
