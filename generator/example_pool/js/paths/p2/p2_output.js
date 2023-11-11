import Pet from '../model/Pet.js';
import ApiException from '../exceptionmodelmodel/ApiException.js';

/**
 * This file was auto generated. Do not modify its content.
 *
 * @file ListPetsRequest
 */
class ListPetsRequest {
    baseUrl = 'http://petstore.swagger.io/v1';

    /**
     * List all pets of a given owner
     *
     * @param owner - The owner
     * @returns Pet[] - An array of pets
     */
    async listPets(owner) {
        const response = await fetch(`${this.baseUrl}/pets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: owner.toJson(),
        });
        if (response.status > 299) {
            throw new ApiException('listPets request failed with status code ' + response.status);
        }
        const json = await response.json();
        return json.map(Pet.fromJson);
    }
}

export default ListPetsRequest;
