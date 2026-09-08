<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    //(nécessaire pour les formulaires d'inscription)
    public function index()
    {
        return response()->json(['data' => Subject::orderBy('name')->get()]);
    }

    // POST /admin/subjects
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:subjects,name'],
        ]);

        $subject = Subject::create($data);

        return response()->json($subject, 201);
    }

    // PATCH /admin/subjects/{subject}
    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:subjects,name,' . $subject->id],
        ]);

        $subject->update($data);

        return response()->json($subject);
    }

    // DELETE /admin/subjects/{subject}
    public function destroy(Subject $subject)
    {
        $subject->delete();

        return response()->json(null, 204);
    }
}