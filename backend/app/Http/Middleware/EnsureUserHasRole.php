<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserHasRole
{
    /**
     * Usage dans les routes : ->middleware('role:super_admin,admin_staff')
     */
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => "Accès refusé : rôle insuffisant.",
            ], 403);
        }

        return $next($request);
    }
}