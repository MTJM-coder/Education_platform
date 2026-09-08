<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterParentRequest;
use App\Http\Requests\Auth\RegisterStudentRequest;
use App\Http\Requests\Auth\RegisterTeacherRequest;
use App\Models\Learner;
use App\Models\ParentProfile;
use App\Models\Teacher;
use App\Models\TeacherAvailability;
use App\Models\TeacherSubject;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function registerParent(RegisterParentRequest $request)
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($request, $data) {
            $user = User::create([
                'first_name'    => $data['first_name'],
                'last_name'     => $data['last_name'],
                'email'         => $data['email'],
                'phone'         => $data['phone'],
                'password_hash' => Hash::make($data['password']),
                'role'          => 'parent',
                'photo_url'     => $request->hasFile('photo')
                    ? $request->file('photo')->store('users/photos', 'public')
                    : null,
            ]);

            ParentProfile::create([
                'user_id'           => $user->id,
                'address'           => $data['address'] ?? null,
                'id_card_photo_url' => $request->hasFile('id_card_photo')
                    ? $request->file('id_card_photo')->store('parents/id_cards', 'public')
                    : null,
            ]);

            return $user;
        });

        return response()->json([
            'user'  => $user->fresh('parentProfile'),
            'token' => $user->createToken('auth')->plainTextToken,
        ], 201);
    }

    public function registerTeacher(RegisterTeacherRequest $request)
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($request, $data) {
            $user = User::create([
                'first_name'    => $data['first_name'],
                'last_name'     => $data['last_name'],
                'email'         => $data['email'],
                'phone'         => $data['phone'],
                'password_hash' => Hash::make($data['password']),
                'role'          => 'teacher',
                'photo_url'     => $request->hasFile('photo')
                    ? $request->file('photo')->store('users/photos', 'public')
                    : null,
            ]);

            Teacher::create([
                'user_id'              => $user->id,
                'id_card_url'          => $request->file('id_card')->store('teachers/id_cards', 'public'),
                'cv_url'               => $request->hasFile('cv')
                    ? $request->file('cv')->store('teachers/cv', 'public')
                    : null,
                'degrees_url'          => $request->hasFile('degrees')
                    ? $request->file('degrees')->store('teachers/degrees', 'public')
                    : null,
                'location_plan_url'    => $request->hasFile('location_plan')
                    ? $request->file('location_plan')->store('teachers/location_plans', 'public')
                    : null,
                'bio'                  => $data['bio'] ?? null,
                'experience_years'     => $data['experience_years'] ?? null,
                'teaching_radius_km'   => $data['teaching_radius_km'] ?? null,
                'location'             => $data['location'],
                'expected_rate'        => $data['expected_rate'] ?? null,
                'section'              => $data['section'],
                'validation_status'    => 'pending', // reste pending tant que le profil n'est pas complet + validé
            ]);

            // Matières déclarées — non validées tant qu'un HOD ne les approuve pas
            foreach ($data['subjects'] ?? [] as $subject) {
                TeacherSubject::create([
                    'teacher_id' => $user->id,
                    'subject_id' => $subject['subject_id'],
                    'class_id'   => $subject['class_id'] ?? null,
                    'validated'  => false,
                ]);
            }

            // Disponibilités déclarées
            foreach ($data['availability'] ?? [] as $slot) {
                TeacherAvailability::create([
                    'teacher_id'  => $user->id,
                    'day_of_week' => $slot['day_of_week'],
                    'start_time'  => $slot['start_time'],
                    'end_time'    => $slot['end_time'],
                ]);
            }

            return $user;
        });

        return response()->json([
            'user'    => $user->fresh(['teacherProfile', 'teacherProfile.teacherSubjects', 'teacherProfile.availabilities']),
            'token'   => $user->createToken('auth')->plainTextToken,
            'message' => 'Profil enseignant créé. En attente de validation par l\'administration.',
        ], 201);
    }

    public function registerStudent(RegisterStudentRequest $request)
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($request, $data) {
            $user = User::create([
                'first_name'    => $data['first_name'],
                'last_name'     => $data['last_name'],
                'email'         => $data['email'],
                'phone'         => $data['phone'],
                'password_hash' => Hash::make($data['password']),
                'role'          => 'student',
                'photo_url'     => $request->hasFile('photo')
                    ? $request->file('photo')->store('users/photos', 'public')
                    : null,
            ]);

            Learner::create([
                'type'        => 'self',
                'user_id'     => $user->id,
                'section'     => $data['section'],
                'level_id'    => $data['level_id'],
                'class_id'    => $data['class_id'],
                'school_name' => $data['school_name'] ?? null,
                'location'    => $data['location'] ?? null,
            ]);

            return $user;
        });

        return response()->json([
            'user'  => $user->fresh('learnerProfile'),
            'token' => $user->createToken('auth')->plainTextToken,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        $user = User::where('email', $credentials['login'])
            ->orWhere('phone', $credentials['login'])
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password_hash)) {
            return response()->json([
                'message' => 'Identifiants invalides.',
            ], 401);
        }

        return response()->json([
            'user'  => $user,
            'token' => $user->createToken('auth')->plainTextToken,
        ]);
    }

    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }
}
