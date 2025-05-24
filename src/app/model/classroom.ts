import { Career } from "./career";
import { Course } from "./course"
import { Teacher } from "./teacher"

export class Classroom{
    idClassroom: number;
    nrc: number;
    Course: Course;
    Teacher: Teacher;
    Career: Career;
    semester: string;
    level: number;
    status: boolean
}