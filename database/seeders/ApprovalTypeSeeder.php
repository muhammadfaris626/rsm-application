<?php

namespace Database\Seeders;

use App\Models\ApprovalType;
use App\Models\UpdateApprovalTypeHistory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ApprovalTypeSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $user = User::first();

        if (!$user) {
            $this->command->warn('ApprovalTypeSeeder: No user found. Creating admin user...');
            $user = User::create([
                'name' => 'Administrator',
                'username' => 'admin',
                'email' => 'admin@rsm.com',
                'password' => \Hash::make('password')
            ]);
        }

        $types = [
            'Purchase Order', 'Request Order', 'Return Request', 'Expenditure',
            'Leave Request', 'Overtime Request', 'Travel Request', 'Reimbursement',
            'Budget Approval', 'Contract Approval', 'Invoice Approval', 'Payment Approval',
            'Asset Request', 'IT Request', 'HR Request', 'Marketing Request',
            'Sales Request', 'Customer Request', 'Vendor Request', 'Supplier Request',
            'Maintenance Request', 'Repair Request', 'Upgrade Request', 'Installation Request',
            'Training Request', 'Event Request', 'Meeting Request', 'Conference Request',
            'Project Approval', 'Task Approval', 'Change Request', 'Issue Resolution',
            'Risk Assessment', 'Quality Check', 'Safety Inspection', 'Compliance Review',
            'Audit Request', 'Review Request', 'Evaluation Request', 'Assessment Request',
            'Renewal Request', 'Extension Request', 'Cancellation Request', 'Modification Request',
            'Transfer Request', 'Promotion Request', 'Salary Request', 'Benefit Request',
            'Equipment Request', 'Material Request', 'Resource Request', 'Support Request'
        ];

        for ($i = 0; $i < 50; $i++) {
            $approvalType = ApprovalType::create([
                'approval_type_name' => $types[$i] ?? 'Approval Type ' . ($i + 1)
            ]);

            UpdateApprovalTypeHistory::create([
                'approval_type_id' => $approvalType->id,
                'user_id' => $user->id
            ]);
        }
    }
}
