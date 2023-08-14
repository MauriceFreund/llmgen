/**
 * This file was auto generated. Do not modify its content.
 *
 * @file PetsApi
 */
class PetsApi {
    baseUrl = 'petstore.swagger.io/v1';

    /**
     * List all pets
     *
     * @returns Pet[] - An array of pets
     */
    async listPets() {
        const response = await fetch(`${this.baseUrl}/pets`);
        const json = await response.json();
        return json.map((pet) => new Pet(pet.id, pet.name, pet.tag));
    }
}

export default PetsApi;
