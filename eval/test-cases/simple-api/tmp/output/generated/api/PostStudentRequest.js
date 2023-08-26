/**
 * This file was auto generated. Do not modify its content.
 *
 * @file PostStudentRequest
 */
class PostStudentRequest {
    baseUrl = 'localhost:3000/';

    async postStudent(student) {
        const response = await fetch(`${this.baseUrl}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });
        return response;
    }
}

export default PostStudentRequest;