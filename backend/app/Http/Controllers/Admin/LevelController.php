<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Level;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    // GET /levels (public — nécessaire pour les formulaires d'inscription)
    public function index()
    {
        return response()->json(['data' => Level::with('classrooms')->orderBy('name')->get()]);
    }

    // POST /admin/levels
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:levels,name'],
        ]);

        $level = Level::create($data);

        return response()->json($level, 201);
    }

    // PATCH /admin/levels/{level}
    public function update(Request $request, Level $level)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:levels,name,' . $level->id],
        ]);

        $level->update($data);

        return response()->json($level);
    }

    // DELETE /admin/levels/{level}
    public function destroy(Level $level)
    {
        $level->delete();

        return response()->json(null, 204);
    }
}