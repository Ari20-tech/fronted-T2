import { Routes } from '@angular/router';
import { CourseComponent } from './pages/course/course.component';
import { TeacherComponent } from './pages/teacher/teacher.component';
import { CourseEditComponent } from './pages/course/course-edit/course-edit.component';
import { TeacherEditComponent } from './pages/teacher/teacher-edit/teacher-edit.component';
import { CareerComponent } from './pages/career/career.component';
import { CareerEditComponent } from './pages/career/career-edit/career-edit.component';
import { ClassroomComponent } from './pages/Classroom/classroom.component';
import { ClassroomEditComponent } from './pages/Classroom/classroom-edit/classroom-edit.component';

export const routes: Routes = [
    {
        path: 'pages/course',
        component: CourseComponent, children: [
            { path: 'new', component: CourseEditComponent },
            { path: 'edit/:id', component: CourseEditComponent },
        ],
    },
    { path: 'pages/teacher', 
        component: TeacherComponent, children: [
            { path: 'new', component: TeacherEditComponent },
            { path: 'edit/:id', component: TeacherEditComponent },
        ], 
    },
     { path: 'pages/career', 
        component: CareerComponent, children: [
            { path: 'new', component: CareerEditComponent },
            { path: 'edit/:id', component: CareerEditComponent },
        ], 
    },
    { path: 'pages/classroom', 
        component: ClassroomComponent, children: [
            { path: 'new', component: ClassroomEditComponent },
            { path: 'edit/:id', component: ClassroomEditComponent },
        ], 
    },
];
