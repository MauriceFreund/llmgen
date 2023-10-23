"""
This file was auto generated. Do not modify its content.

@file ListPetsRequest
"""
import requests
from typing import List

from ..model.Pet import Pet
from ..exception.ApiException import ApiException


class ListPetsRequest:

    baseUrl = 'petstore.swagger.io/v1'

    def list_pet(self) -> List[Pet]:
        """
        List all pets

        Returns:
            list[Pet]: A list of pets
        """
        response = requests.get(f'{self.baseUrl}/pets')
        if response.status_code > 299:
            raise ApiException("list_pet request failed with status code " + response.status_code)
        return [Pet.fromJson(pet) for pet in response.json()]
