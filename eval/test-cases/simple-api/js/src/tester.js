import GetStudentsRequest from './generated/api/GetStudentsRequest.js';
import PostStudentRequest from './generated/api/PostStudentRequest.js';
import GetStudentByIdRequest from './generated/api/GetStudentByIdRequest.js';
import GetExamsByStudentIdRequest from './generated/api/GetExamsByStudentIdRequest.js';
import Student from './generated/model/Student.js';
import Exam from './generated/model/Exam.js';

const TEST_OUTPUT_MARKER="#+#"

let successes = [];
let fails = [];

async function getAllStudents() {
    try {
        const students = await new GetStudentsRequest().getStudents();
        const expectedStudents = [
            new Student(1, "John", "Doe"),
            new Student(2, "Jane", "Doe"),
        ]
        if (JSON.stringify(students) !== JSON.stringify(expectedStudents)) {
            console.log(
                `getAllStudents failed: ${JSON.stringify(students)} did not match expected ${JSON.stringify(expectedStudents)}`
            );
            fails.push('getAllStudents:Received students that did not match expected values');
        } else {
            successes.push('getAllStudents');
        }
    } catch (e) {
        fails.push(`getAllStudents:${e}`);
    }
}

async function postValidStudent() {
    try {
        const newStudent = new Student(3, "Some", "Dude");
        await new PostStudentRequest().postStudent(newStudent);
        successes.push('postValidStudent');
    } catch (e) {
        fails.push(`postValidStudent:${e}`);
    }
}

async function postInvalidStudent() {
    try {
        const newStudent = new Student(1, "Some", "Dude");
        await new PostStudentRequest().postStudent(newStudent);
        fails.push(`postInvalidStudent:Post student with existing id should have let to error`);
    } catch (e) {
        successes.push('postInvalidStudent');
    }
}

async function getExistingStudent() {
    try {
        const student = await new GetStudentByIdRequest().getStudentById(1);
        if (
            student.id === 1
            && student.firstName === 'Rainer'
            && student.lastName === 'Zufall'
        ) {
            successes.push('getExistingStudent');
        } else {
            console.log(
                `getExistingStudent failed: ${JSON.stringify(student)} did not match expected values`
            );
            fails.push('getExistingStudent:Received student did not match expected values');
        }
    } catch (e) {
        fails.push(`getExistingStudent:${e}`);
    }
}

async function getNonExistingStudent() {
    try {
        await new GetStudentByIdRequest().getStudentById(44);
        fails.push('getNonExistingStudent:Requesting student with not existing id should have let to error');
    } catch (e) {
        successes.push('getNonExistingStudent');
    }
}

async function getExamsOfExistingStudent() {
    try {
        const exams = await new GetExamsByStudentIdRequest().getExamsByStudentId(1);
        const expectedExams = [
            new Exam(1, 'English'),
            new Exam(2, 'Math'),
        ];
        if (JSON.stringify(exams) === JSON.stringify(expectedExams)) {
            successes.push('getExamsOfExistingStudent');
        } else {
            console.log(
                `getExamsOfExistingStudent failed: ${JSON.stringify(exams)} did not match expected ${JSON.stringify(expectedExams)}`
            );
            fails.push('getExamsOfExistingStudent:Received exams did not match expected data');
        }
    } catch (e) {
        fails.push(`getExamsOfExistingStudent:${e}`);
    }
}

async function getExamsOfNonExistingStudent() {
    try {
        await new GetStudentByIdRequest().getStudentById(44);
        fails.push('getExamsOfNonExistingStudent:Requesting student with not existing id should have let to error');
    } catch (e) {
        successes.push('getExamsOfNonExistingStudent');
    }
}


await getAllStudents();
await postValidStudent();
await postInvalidStudent();
await getExistingStudent();
await getNonExistingStudent();
await getExamsOfExistingStudent();
await getExamsOfNonExistingStudent();

const numSuccesses = successes.length;
const numTests = numSuccesses + fails.length;
const successRate = numSuccesses / numTests;

const result = {
    "successful_tests": successes,
    "failed_tests": fails,
    "num_successes": numSuccesses,
    "num_tests": numTests,
    "success_rate": successRate,
}

console.log(TEST_OUTPUT_MARKER);
console.log(JSON.stringify(result));
console.log(TEST_OUTPUT_MARKER);
