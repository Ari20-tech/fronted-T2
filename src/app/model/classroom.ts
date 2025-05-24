import { Career } from "./career";
import { Course } from "./course"
import { Teacher } from "./teacher"

export type { Career, Course, Teacher }; 


export class Classroom{
    idClassroom: number;
    nrc: number;
    idCourse: Course;
    idTeacher: Teacher;
    idCareer: Career;
    semester: string;
    level: number;
    status: boolean
}


