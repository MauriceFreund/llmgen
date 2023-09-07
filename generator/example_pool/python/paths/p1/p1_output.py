"""
This file was auto generated. Do not modify its content.

@file ListPetsRequest
"""
import requests
from typing import List

from ..model.Pet import Pet


class ListPetsRequest:

    baseUrl = 'petstore.swagger.io/v1'

    def list_pet(self) -> List[Pet]:
        response = requests.get(f'{self.baseUrl}/pets')
        return [Pet(**pet) for pet in response.json()]
