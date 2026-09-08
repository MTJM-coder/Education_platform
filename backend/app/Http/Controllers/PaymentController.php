<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\CreatePaymentRequest;
use App\Models\Assignment;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // POST /assignments/{assignment}/payments
    // Autorisation : propriétaire de la demande (parent/learner), ou Admin.
    public function store(CreatePaymentRequest $request, Assignment $assignment)
    {
        if (empty($assignment->agreed_price)) {
            return response()->json([
                'message' => "Le prix de cette affectation n'a pas encore été fixé par l'admin.",
            ], 422);
        }

        $data = $request->validated();

        $payment = Payment::create([
            'assignment_id' => $assignment->id,
            'amount'        => $assignment->agreed_price,
            'currency'      => 'XAF',
            'method'        => $data['method'],
            'period'        => $data['period'],
            'status'        => 'pending',
            'escrow_status' => 'held',
        ]);

        return response()->json($payment, 201);
    }

    // POST /payments/{payment}/simulate
    // Simule le retour du fournisseur Mobile Money (à remplacer plus tard par un vrai webhook).
    // Autorisation : propriétaire de la demande, ou Admin.
    public function simulate(Request $request, Payment $payment)
    {
        $this->assertCanAccess($payment, $request->user());

        $data = $request->validate([
            'result' => ['required', 'string', 'in:success,failure'],
        ]);

        if ($payment->status !== 'pending') {
            return response()->json(['message' => 'Ce paiement a déjà été traité.'], 422);
        }

        if ($data['result'] === 'failure') {
            $payment->update(['status' => 'failed']);

            return response()->json($payment->fresh());
        }

        $commissionRate = (float) Setting::get('commission_rate', 10);
        $commissionAmount = round($payment->amount * $commissionRate / 100, 2);
        $teacherAmount = round($payment->amount - $commissionAmount, 2);

        $payment->update([
            'status'             => 'paid',
            'commission_amount'  => $commissionAmount,
            'teacher_amount'     => $teacherAmount,
            'escrow_status'      => 'held',
        ]);

        return response()->json($payment->fresh());
    }

    // PATCH /admin/payments/{payment}/release
    // Autorisation : Admin uniquement (middleware 'role' sur la route).
    public function release(Payment $payment)
    {
        if ($payment->status !== 'paid' || $payment->escrow_status !== 'held') {
            return response()->json([
                'message' => 'Ce paiement ne peut pas être libéré dans son état actuel.',
            ], 422);
        }

        $payment->update([
            'escrow_status'       => 'released',
            'escrow_release_date' => now(),
        ]);

        return response()->json($payment->fresh());
    }

    // PATCH /admin/payments/{payment}/refund
    // Autorisation : Admin uniquement. Couvre notamment le cas "enseignant absent"
    // (règle validée par le client), décidé manuellement par l'Admin pour l'instant.
    public function refund(Request $request, Payment $payment)
    {
        if ($payment->escrow_status === 'released') {
            return response()->json([
                'message' => 'Ce paiement a déjà été libéré à l\'enseignant, remboursement impossible.',
            ], 422);
        }

        $payment->update([
            'status'        => 'refunded',
            'escrow_status' => 'refunded',
        ]);

        return response()->json($payment->fresh());
    }

    // GET /admin/settings/commission-rate
    public function getCommissionRate()
    {
        return response()->json(['commission_rate' => (float) Setting::get('commission_rate', 10)]);
    }

    // PATCH /admin/settings/commission-rate
    public function setCommissionRate(Request $request)
    {
        $data = $request->validate([
            'commission_rate' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        Setting::set('commission_rate', $data['commission_rate']);

        return response()->json(['commission_rate' => (float) $data['commission_rate']]);
    }

    private function assertCanAccess(Payment $payment, User $user): void
    {
        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return;
        }

        if (! $payment->assignment->tutoringRequest->learner->isOwnedBy($user)) {
            abort(403, "Vous n'avez pas accès à ce paiement.");
        }
    }
}