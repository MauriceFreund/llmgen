from generated.api.GetStudentsRequest import GetStudentsRequest
from generated.api.PostStudentRequest import PostStudentRequest
from generated.api.GetStudentByIdRequest import GetStudentByIdRequest
from generated.api.GetExamsByStudentIdRequest import GetExamsByStudentIdRequest
from generated.model.Student import Student
from generated.model.Exam import Exam
from generated.exception.ApiException import ApiException
import json

TEST_OUTPUT_MARKER = "#+#"

successes = []
fails = []


def get_all_students():
    try:
        students = GetStudentsRequest().get_students()
        expected_students = [
            Student(1, "Doe", "John"),
            Student(2, "Doe", "Jane")
        ]
        if students != expected_students:
            fails.append('getAllStudents:Received students that did not match expected values')
        else:
            successes.append('getAllStudents')
    except Exception as e:
        fails.append(f"getAllStudents:{e}")


def post_valid_student():
    try:
        new_student = Student(3, "Some", "Dude")
        PostStudentRequest().post_student(new_student)
        successes.append('postValidStudent')
    except Exception as e:
        fails.append(f"postValidStudent:{e}")


def post_invalid_student():
    try:
        new_student = Student(1, "Some", "Dude")
        PostStudentRequest().post_student(new_student)
        fails.append('postInvalidStudent:Post student with existing id should have led to error')
    except ApiException:
        successes.append('postInvalidStudent')
    except Exception as e:
        fails.append(f'postInvalidStudent:{e}')


def get_existing_student():
    try:
        student = GetStudentByIdRequest().get_student_by_id(1)
        expected_student = Student(1, "Zufall", "Rainer")
        if student == expected_student:
            successes.append('getExistingStudent')
        else:
            print(f"getExistingStudent failed: {student} did not match expected values")
            fails.append('getExistingStudent:Received student did not match expected values')
    except Exception as e:
        fails.append(f"getExistingStudent:{e}")


def get_non_existing_student():
    try:
        GetStudentByIdRequest().get_student_by_id(44)
        fails.append('getNonExistingStudent:Requesting student with not existing id should have led to error')
    except ApiException:
        successes.append('getNonExistingStudent')
    except Exception as e:
        fails.append(f'getNonExistingStudent:{e}')


def get_exams_of_existing_student():
    try:
        exams = GetExamsByStudentIdRequest().get_exams_by_student_id(1)
        expected_exams = [
            Exam(1, 'English'),
            Exam(2, 'Math')
        ]
        if exams == expected_exams:
            successes.append('getExamsOfExistingStudent')
        else:
            print(f"getExamsOfExistingStudent failed: {exams} did not match expected {expected_exams}")
            fails.append('getExamsOfExistingStudent:Received exams did not match expected data')
    except Exception as e:
        fails.append(f"getExamsOfExistingStudent:{e}")


def get_exams_of_non_existing_student():
    try:
        GetExamsByStudentIdRequest().get_exams_by_student_id(44)
        fails.append('getExamsOfNonExistingStudent:Requesting student with not existing id should have led to error')
    except ApiException:
        successes.append('getExamsOfNonExistingStudent')
    except Exception as e:
        fails.append(f"getExamsOfNonExistingStudent:{e}")


# Execute the functions
get_all_students()
post_valid_student()
post_invalid_student()
get_existing_student()
get_non_existing_student()
get_exams_of_existing_student()
get_exams_of_non_existing_student()

num_successes = len(successes)
num_tests = num_successes + len(fails)
success_rate = num_successes / num_tests

result = {
    "successful_tests": successes,
    "failed_tests": fails,
    "num_successes": num_successes,
    "num_tests": num_tests,
    "success_rate": success_rate,
}

print(TEST_OUTPUT_MARKER)
print(json.dumps(result))
print(TEST_OUTPUT_MARKER)
