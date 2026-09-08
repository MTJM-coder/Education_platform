<?php

namespace App\Http\Requests\Payment;

use App\Models\Assignment;
use Illuminate\Foundation\Http\FormRequest;

class CreatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Assignment $assignment */
        $assignment = $this->route('assignment');

        if (! $assignment) {
            return true;
        }

        $user = $this->user();

        if (in_array($user->role, ['super_admin', 'admin_staff'], true)) {
            return true;
        }

        // Seul le propriétaire de la demande (parent/learner) peut payer.
        return $assignment->tutoringRequest->learner->isOwnedBy($user);
    }

    public function rules(): array
    {
        return [
            'method' => ['required', 'string', 'in:mobile_money,bank_transfer,other'],
            'period' => ['required', 'string', 'in:hourly,weekly,monthly'],
        ];
    }
}