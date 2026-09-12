<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\TeacherValidationController;
use App\Http\Controllers\Admin\TeacherSubjectValidationController;
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Admin\LevelController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\TutoringRequestController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DisputeController;
use App\Http\Controllers\AcademicEvaluationController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\TeacherReviewController;
use App\Http\Controllers\AwardController;
use App\Http\Controllers\LectureNoteController;

Route::prefix('auth')->group(function () {
    Route::post('/register/parent', [AuthController::class, 'registerParent']);
    Route::post('/register/teacher', [AuthController::class, 'registerTeacher']);
    Route::post('/register/student', [AuthController::class, 'registerStudent']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'role:super_admin,admin_staff'])->prefix('admin')->group(function () {

    //  Validation globale du profil enseignant 
    Route::get('/teachers/pending', [TeacherValidationController::class, 'pending']);
    Route::patch('/teachers/{teacher}/validate', [TeacherValidationController::class, 'validateProfile']);

    // Validation d'une matière déclarée 
    Route::get('/subjects/{subject}/pending-teachers', [TeacherSubjectValidationController::class, 'pending']);
    Route::patch('/teachers/{teacher}/subjects/{subject}/validate', [TeacherSubjectValidationController::class, 'validateSubject']);
});



Route::get('/subjects', [SubjectController::class, 'index']);
Route::get('/levels', [LevelController::class, 'index']);
Route::get('/levels/{level}/classes', [ClassRoomController::class, 'index']);

//Écriture réservée à l'Admin
Route::middleware(['auth:sanctum', 'role:super_admin,admin_staff'])->prefix('admin')->group(function () {
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::patch('/subjects/{subject}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy']);

    Route::post('/levels', [LevelController::class, 'store']);
    Route::patch('/levels/{level}', [LevelController::class, 'update']);
    Route::delete('/levels/{level}', [LevelController::class, 'destroy']);

    Route::post('/levels/{level}/classes', [ClassroomController::class, 'store']);
    Route::patch('/classes/{classroom}', [ClassroomController::class, 'update']);
    Route::delete('/classes/{classroom}', [ClassroomController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/tutoring-requests', [TutoringRequestController::class, 'store']);
    Route::get('/tutoring-requests/{tutoringRequest}/matches', [TutoringRequestController::class, 'matches']);
});

Route::middleware('auth:sanctum')->group(function () {
    // Autorisation fine faite dans le contrôleur (propriétaire / enseignant assigné / admin)
    Route::post('/tutoring-requests/{tutoringRequest}/assignments', [AssignmentController::class, 'store']);
    Route::get('/assignments/{assignment}', [AssignmentController::class, 'show']);
    Route::patch('/assignments/{assignment}/cancel', [AssignmentController::class, 'cancel']);
    Route::get('/teachers/{teacher}/assignments', [AssignmentController::class, 'teacherAssignments']);

    // Réservé à l'Admin 
    Route::middleware('role:super_admin,admin_staff')->prefix('admin')->group(function () {
        Route::patch('/assignments/{assignment}/validate', [AssignmentController::class, 'validateAssignment']);
        Route::patch('/assignments/{assignment}/price', [AssignmentController::class, 'setPrice']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/assignments/{assignment}/sessions', [SessionController::class, 'store']);
    Route::get('/assignments/{assignment}/sessions', [SessionController::class, 'index']);
    Route::patch('/sessions/{session}/confirm', [SessionController::class, 'confirm']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/assignments/{assignment}/payments', [PaymentController::class, 'store']);
    Route::post('/payments/{payment}/simulate', [PaymentController::class, 'simulate']);

    Route::middleware('role:super_admin,admin_staff')->prefix('admin')->group(function () {
        Route::patch('/payments/{payment}/release', [PaymentController::class, 'release']);
        Route::patch('/payments/{payment}/refund', [PaymentController::class, 'refund']);
        Route::get('/settings/commission-rate', [PaymentController::class, 'getCommissionRate']);
        Route::patch('/settings/commission-rate', [PaymentController::class, 'setCommissionRate']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me/disputes', [DisputeController::class, 'index']);
    Route::get('/disputes/{dispute}', [DisputeController::class, 'show']);
    Route::post('/sessions/{session}/dispute', [DisputeController::class, 'store']);

    Route::middleware('role:super_admin,admin_staff')->prefix('admin')->group(function () {
        Route::patch('/disputes/{dispute}/resolve', [DisputeController::class, 'resolve']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/evaluations/{evaluation}', [AcademicEvaluationController::class, 'show']);
    Route::get('/evaluations/{evaluation}/questions', [AcademicEvaluationController::class, 'listQuestions']);
    Route::post('/evaluations/{evaluation}/results', [ResultController::class, 'store']);
    Route::get('/learners/{learner}/results', [ResultController::class, 'learnerResults']);

    Route::middleware('role:super_admin,admin_staff')->prefix('admin')->group(function () {
        Route::post('/subjects/{subject}/evaluations', [AcademicEvaluationController::class, 'store']);
        Route::post('/evaluations/{evaluation}/questions', [AcademicEvaluationController::class, 'addQuestion']);
        Route::get('/evaluations/{evaluation}/results', [ResultController::class, 'evaluationResults']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me/reviews', [TeacherReviewController::class, 'index']);
    Route::get('/assignments/{assignment}/review', [TeacherReviewController::class, 'show']);
    Route::put('/assignments/{assignment}/review', [TeacherReviewController::class, 'store']);
});

Route::get('/awards/monthly', [AwardController::class, 'index']);

Route::middleware(['auth:sanctum', 'role:super_admin,admin_staff'])->prefix('admin')->group(function () {
    Route::post('/awards/compute', [AwardController::class, 'compute']);
    Route::patch('/awards/{award}/prize', [AwardController::class, 'setPrize']);
});


// Public — aucune authentification requise (notes déjà approuvées uniquement)
Route::get('/lecture-notes', [LectureNoteController::class, 'index']);

// Authentifié — à placer dans le groupe middleware('auth:sanctum') existant
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/teachers/{teacher}/lecture-notes', [LectureNoteController::class, 'store']);
    Route::get('/teachers/{teacher}/lecture-notes', [LectureNoteController::class, 'myNotes']);
    // Admin uniquement — même convention que les autres routes /admin/...
Route::middleware('role:super_admin,admin_staff')->group(function () {
    Route::get('/admin/lecture-notes/pending', [LectureNoteController::class, 'pending']);
    Route::patch('/admin/lecture-notes/{lectureNote}/validate', [LectureNoteController::class, 'validateNote']);
});

});


