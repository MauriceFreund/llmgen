/**
 * This file was auto generated. Do not modify its content.
 *
 * @file GetExamsByStudentIdRequest
 */
class GetExamsByStudentIdRequest {
    baseUrl = 'localhost:3000/';

    async getExamsByStudentId(studentId) {
        const response = await fetch(`${this.baseUrl}/exams/${studentId}`);
        const json = await response.json();
        return json;
    }
}

export default GetExamsByStudentIdRequest;