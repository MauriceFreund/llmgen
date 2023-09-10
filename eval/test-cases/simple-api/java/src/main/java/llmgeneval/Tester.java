package llmgeneval;

import com.fasterxml.jackson.databind.ObjectMapper;
import llmgeneval.generated.api.GetStudentsRequest;
import llmgeneval.generated.api.PostStudentRequest;
import llmgeneval.generated.api.GetStudentByIdRequest;
import llmgeneval.generated.api.GetExamsByStudentIdRequest;
import llmgeneval.generated.model.Student;
import llmgeneval.generated.model.Exam;
import llmgeneval.generated.exception.ApiException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Tester {
    private static final String TEST_OUTPUT_MARKER = "#+#";
    private static List<String> successes = new ArrayList<>();
    private static List<String> fails = new ArrayList<>();

    public static void main(String[] args) {
        getAllStudents();
        postValidStudent();
        postInvalidStudent();
        getExistingStudent();
        getNonExistingStudent();
        getExamsOfExistingStudent();
        getExamsOfNonExistingStudent();

        int numSuccesses = successes.size();
        int numTests = numSuccesses + fails.size();
        double successRate = (double) numSuccesses / numTests;

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String result = objectMapper.writeValueAsString(new TestResult(successes, fails, numSuccesses, numTests, successRate));
            System.out.println(TEST_OUTPUT_MARKER);
            System.out.println(result);
            System.out.println(TEST_OUTPUT_MARKER);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void getAllStudents() {
        try {
            List<Student> students = new GetStudentsRequest().getStudents();
            List<Student> expectedStudents = Arrays.asList(new Student(1, "Doe", "John"), new Student(2, "Doe", "Jane"));
            if (!students.equals(expectedStudents)) {
                System.out.println("getAllStudents failed: " + students + " did not match expected " + expectedStudents);
                fails.add("getAllStudents:Received students that did not match expected values");
            } else {
                successes.add("getAllStudents");
            }
        } catch (Exception e) {
            fails.add("getAllStudents:" + e.getMessage());
        }
    }

    public static void postValidStudent() {
        try {
            Student newStudent = new Student(3, "Some", "Dude");
            new PostStudentRequest().postStudent(newStudent);
            successes.add("postValidStudent");
        } catch (Exception e) {
            fails.add("postValidStudent:" + e.getMessage());
        } 
    }

    public static void postInvalidStudent() {
        try {
            Student newStudent = new Student(1, "Some", "Dude");
            new PostStudentRequest().postStudent(newStudent);
            fails.add("postInvalidStudent:Post student with existing id should have led to error");
        } catch (ApiException e) {
            successes.add("postInvalidStudent");
        } catch (Exception e) {
            fails.add("postInvalidStudent:" + e.getMessage());
        }

    }

    public static void getExistingStudent() {
        try {
            Student student = new GetStudentByIdRequest().getStudentById(1);
            Student expectedStudent = new Student(1, "Zufall", "Rainer");
            if (student.equals(expectedStudent)) {
                successes.add("getExistingStudent");
            } else {
                System.out.println("getExistingStudent failed: " + student + " did not match expected values");
                fails.add("getExistingStudent:Received student did not match expected values");
            }
        } catch (Exception e) {
            fails.add("getExistingStudent:" + e.getMessage());
        }
    }

    public static void getNonExistingStudent() {
        try {
            new GetStudentByIdRequest().getStudentById(44);
            fails.add("getNonExistingStudent:Requesting student with non-existing id should have led to error");
        } catch (ApiException e) {
            successes.add("getNonExistingStudent");
        } catch (Exception e) {
            fails.add("getNonExistingStudent" + e.getMessage());
        }

    }

    public static void getExamsOfExistingStudent() {
        try {
            List<Exam> exams = new GetExamsByStudentIdRequest().getExamsByStudentId(1);
            List<Exam> expectedExams = Arrays.asList(new Exam(1, "English"), new Exam(2, "Math"));
            if (exams.equals(expectedExams)) {
                successes.add("getExamsOfExistingStudent");
            } else {
                System.out.println("getExamsOfExistingStudent failed: " + exams + " did not match expected " + expectedExams);
                fails.add("getExamsOfExistingStudent:Received exams did not match expected data");
            }
        } catch (Exception e) {
            fails.add("getExamsOfExistingStudent:" + e.getMessage());
        }
    }

    public static void getExamsOfNonExistingStudent() {
        try {
            new GetExamsByStudentIdRequest().getExamsByStudentId(44);
            fails.add("getExamsOfNonExistingStudent:Requesting student with non-existing id should have led to error");
        } catch (ApiException e) {
            successes.add("getExamsOfNonExistingStudent");
        } catch (Exception e) {
            fails.add("getExamsOfNonExistingStudent" + e.getMessage());
        }

    }
}

