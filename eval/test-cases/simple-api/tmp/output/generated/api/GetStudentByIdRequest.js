/**
 * This file was auto generated. Do not modify its content.
 *
 * @file GetStudentByIdRequest
 */
class GetStudentByIdRequest {
    baseUrl = 'localhost:3000/';

    async getStudentById(studentId) {
        const response = await fetch(`${this.baseUrl}/students/${studentId}`);
        const json = await response.json();
        return json;
    }
}

export default GetStudentByIdRequest;