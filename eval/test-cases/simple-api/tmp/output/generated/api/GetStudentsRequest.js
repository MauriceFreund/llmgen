/**
 * This file was auto generated. Do not modify its content.
 *
 * @file GetStudentsRequest
 */
class GetStudentsRequest {
    baseUrl = 'localhost:3000/';

    async getStudents() {
        const response = await fetch(`${this.baseUrl}/students`);
        const json = await response.json();
        return json;
    }
}

export default GetStudentsRequest;