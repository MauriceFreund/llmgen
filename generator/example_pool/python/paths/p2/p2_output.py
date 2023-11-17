import requests
from typing import List

from ..model.Pet import Pet
from ..exception.ApiException import ApiException


class ListPetsRequest:

    baseUrl = 'petstore.swagger.io/v1'

    def list_pets(self, owner) -> List[Pet]:
        """
        List all pets of a given owner
        
        Args:
            owner (Owner): The owner

        Returns:
            list[Pet]: A list of pets
        """
        response = requests.post(f'{self.baseUrl}/pets', json=owner.toJson())
        if response.status_code > 299:
            raise ApiException(f"list_pet request failed with status code {response.status_code}")
        return [Pet.fromJson(pet) for pet in response.json()]
