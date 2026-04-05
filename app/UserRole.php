<?php

namespace App;

enum UserRole: string
{
    case Student = 'student';
    case Lawyer = 'lawyer';
    case Researcher = 'researcher';
    case Admin = 'admin';
}
