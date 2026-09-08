<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use App\Models\Level;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    // GET /levels/{level}/classes (public — nécessaire pour les formulaires d'inscription)
    public function index(Level $level)
    {
        return response()->json(['data' => $level->classrooms()->orderBy('name')->get()]);
    }

    // POST /admin/levels/{level}/classes
    public function store(Request $request, Level $level)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $classroom = ClassRoom::create([
            'name'     => $data['name'],
            'level_id' => $level->id,
        ]);

        return response()->json($classroom, 201);
    }

    // PATCH /admin/classes/{classroom}
    public function update(Request $request, ClassRoom $classroom)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $classroom->update($data);

        return response()->json($classroom);
    }

    // DELETE /admin/classes/{classroom}
    public function destroy(ClassRoom $classroom)
    {
        $classroom->delete();

        return response()->json(null, 204);
    }
}