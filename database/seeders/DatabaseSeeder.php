<?php

namespace Database\Seeders;

use App\Models\ContractAnalysis;
use App\Models\LegalDocument;
use App\Models\LegalTemplate;
use App\Models\SearchLog;
use App\Models\User;
use App\UserRole;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin users
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@laxpng.com',
            'role' => UserRole::Admin,
        ]);

        User::factory()->create([
            'name' => 'Mark Johnnah',
            'email' => 'markjohnnah@gmail.com',
            'role' => UserRole::Admin,
        ]);

        // Role-specific users
        $lawyer = User::factory()->create([
            'name' => 'Test Lawyer',
            'email' => 'lawyer@laxpng.com',
            'role' => UserRole::Lawyer,
        ]);

        $student = User::factory()->create([
            'name' => 'Test Student',
            'email' => 'student@laxpng.com',
            'role' => UserRole::Student,
        ]);

        $researcher = User::factory()->create([
            'name' => 'Test Researcher',
            'email' => 'researcher@laxpng.com',
            'role' => UserRole::Researcher,
        ]);

        // Extra users
        User::factory(6)->create();
        User::factory(3)->lawyer()->create();
        User::factory(2)->researcher()->create();

        // Legal documents
        LegalDocument::factory(10)->act()->create();
        LegalDocument::factory(10)->caselaw()->create();
        LegalDocument::factory(3)->pending()->create();

        LegalTemplate::factory(5)->create();

        // Search logs spread across users
        $searchQueries = [
            'Constitutional rights in Papua New Guinea',
            'Land dispute resolution PNG',
            'Employment Act 1978 termination provisions',
            'Criminal Code Act section 383A',
            'Customary law vs statutory law PNG',
            'Mining and petroleum regulations',
            'Family law custody rulings PNG',
            'Company registration requirements',
            'Environmental protection law PNG',
            'Contract enforcement remedies',
            'Supreme Court appeal procedure',
            'Human rights violations case law',
            'Wills and succession Act PNG',
            'Village court jurisdiction',
            'Anti-corruption legislation PNG',
        ];

        foreach ([$admin, $lawyer, $student, $researcher] as $user) {
            foreach (fake()->randomElements($searchQueries, fake()->numberBetween(3, 8)) as $query) {
                SearchLog::factory()->create([
                    'user_id' => $user->id,
                    'query' => $query,
                    'results_count' => fake()->numberBetween(1, 45),
                    'response_time_ms' => fake()->numberBetween(200, 3500),
                ]);
            }
        }

        // Contract analyses
        ContractAnalysis::factory(3)->for($lawyer)->create();
        ContractAnalysis::factory(2)->for($student)->create();
        ContractAnalysis::factory(1)->pending()->for($lawyer)->create();

        // Seed realistic PNG legal templates
        LegalTemplate::create([
            'title' => 'General Affidavit',
            'category' => 'affidavit',
            'description' => 'A general-purpose affidavit for use in Papua New Guinea courts.',
            'content' => "AFFIDAVIT\n\nI, [party_name], of [address], in Papua New Guinea, make oath and say as follows:\n\n1. I am the [role] in this matter.\n\n2. [statement]\n\n3. This affidavit is made in support of [purpose].\n\nSworn at [location] this [date].\n\n____________________\n[party_name]\nDeponent",
            'fields' => [
                ['name' => 'party_name', 'type' => 'text', 'label' => 'Full Name of Deponent'],
                ['name' => 'address', 'type' => 'text', 'label' => 'Address'],
                ['name' => 'role', 'type' => 'text', 'label' => 'Role (e.g., Plaintiff, Defendant)'],
                ['name' => 'statement', 'type' => 'textarea', 'label' => 'Statement of Facts'],
                ['name' => 'purpose', 'type' => 'text', 'label' => 'Purpose of Affidavit'],
                ['name' => 'location', 'type' => 'text', 'label' => 'Location of Swearing'],
                ['name' => 'date', 'type' => 'date', 'label' => 'Date'],
            ],
            'is_active' => true,
        ]);

        LegalTemplate::create([
            'title' => 'Simple Employment Contract',
            'category' => 'contract',
            'description' => 'An employment contract compliant with the PNG Employment Act 1978.',
            'content' => "EMPLOYMENT CONTRACT\n\nThis Employment Contract is entered into on [date] between:\n\nEmployer: [employer_name], of [employer_address]\nEmployee: [employee_name], of [employee_address]\n\n1. POSITION: The Employee is employed as [position].\n2. COMMENCEMENT: Employment commences on [start_date].\n3. REMUNERATION: The Employee shall receive [salary] per [pay_period].\n4. HOURS: The Employee shall work [hours] hours per week.\n5. DUTIES: [duties]\n6. TERMINATION: Either party may terminate with [notice_period] notice.\n\nThis contract is governed by the laws of Papua New Guinea, including the Employment Act 1978.\n\n____________________\nEmployer\n\n____________________\nEmployee",
            'fields' => [
                ['name' => 'employer_name', 'type' => 'text', 'label' => 'Employer Name'],
                ['name' => 'employer_address', 'type' => 'text', 'label' => 'Employer Address'],
                ['name' => 'employee_name', 'type' => 'text', 'label' => 'Employee Name'],
                ['name' => 'employee_address', 'type' => 'text', 'label' => 'Employee Address'],
                ['name' => 'position', 'type' => 'text', 'label' => 'Job Position'],
                ['name' => 'start_date', 'type' => 'date', 'label' => 'Start Date'],
                ['name' => 'salary', 'type' => 'text', 'label' => 'Salary Amount (PGK)'],
                ['name' => 'pay_period', 'type' => 'text', 'label' => 'Pay Period (e.g., fortnight, month)'],
                ['name' => 'hours', 'type' => 'text', 'label' => 'Weekly Hours'],
                ['name' => 'duties', 'type' => 'textarea', 'label' => 'Key Duties'],
                ['name' => 'notice_period', 'type' => 'text', 'label' => 'Notice Period'],
                ['name' => 'date', 'type' => 'date', 'label' => 'Contract Date'],
            ],
            'is_active' => true,
        ]);

        LegalTemplate::create([
            'title' => 'Power of Attorney',
            'category' => 'power_of_attorney',
            'description' => 'A general power of attorney for PNG legal proceedings.',
            'content' => "POWER OF ATTORNEY\n\nI, [grantor_name], of [grantor_address], Papua New Guinea, hereby appoint [attorney_name], of [attorney_address], as my lawful attorney to act on my behalf in the following matters:\n\n[scope]\n\nThis Power of Attorney shall remain in effect from [start_date] until [end_date] unless revoked earlier in writing.\n\nSigned at [location] on [date].\n\n____________________\n[grantor_name]\nGrantor\n\nWitness:\n____________________\nName:\nDate:",
            'fields' => [
                ['name' => 'grantor_name', 'type' => 'text', 'label' => 'Grantor Full Name'],
                ['name' => 'grantor_address', 'type' => 'text', 'label' => 'Grantor Address'],
                ['name' => 'attorney_name', 'type' => 'text', 'label' => 'Attorney Full Name'],
                ['name' => 'attorney_address', 'type' => 'text', 'label' => 'Attorney Address'],
                ['name' => 'scope', 'type' => 'textarea', 'label' => 'Scope of Authority'],
                ['name' => 'start_date', 'type' => 'date', 'label' => 'Start Date'],
                ['name' => 'end_date', 'type' => 'date', 'label' => 'End Date'],
                ['name' => 'location', 'type' => 'text', 'label' => 'Location of Signing'],
                ['name' => 'date', 'type' => 'date', 'label' => 'Date of Signing'],
            ],
            'is_active' => true,
        ]);

        LegalTemplate::create([
            'title' => 'Lease Agreement',
            'category' => 'lease',
            'description' => 'A residential lease agreement for property in Papua New Guinea.',
            'content' => "RESIDENTIAL LEASE AGREEMENT\n\nThis Lease Agreement is made on [date] between:\n\nLandlord: [landlord_name]\nTenant: [tenant_name]\n\nPROPERTY: [property_address]\n\n1. TERM: The lease shall commence on [start_date] and end on [end_date].\n2. RENT: The Tenant shall pay [rent_amount] PGK per [rent_period].\n3. BOND: A bond of [bond_amount] PGK shall be paid on signing.\n4. USE: The property shall be used for residential purposes only.\n5. CONDITION: The Tenant shall maintain the property in good condition.\n\nThis agreement is governed by the laws of Papua New Guinea.\n\n____________________\nLandlord\n\n____________________\nTenant",
            'fields' => [
                ['name' => 'landlord_name', 'type' => 'text', 'label' => 'Landlord Name'],
                ['name' => 'tenant_name', 'type' => 'text', 'label' => 'Tenant Name'],
                ['name' => 'property_address', 'type' => 'text', 'label' => 'Property Address'],
                ['name' => 'start_date', 'type' => 'date', 'label' => 'Lease Start Date'],
                ['name' => 'end_date', 'type' => 'date', 'label' => 'Lease End Date'],
                ['name' => 'rent_amount', 'type' => 'text', 'label' => 'Monthly Rent (PGK)'],
                ['name' => 'rent_period', 'type' => 'text', 'label' => 'Rent Period (e.g., month, fortnight)'],
                ['name' => 'bond_amount', 'type' => 'text', 'label' => 'Bond Amount (PGK)'],
                ['name' => 'date', 'type' => 'date', 'label' => 'Agreement Date'],
            ],
            'is_active' => true,
        ]);
    }
}
