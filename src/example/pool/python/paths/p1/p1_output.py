"""
This file was auto generated. Do not modify its content.

@file PetsApi
"""
import requests
from typing import List

from apiclient.model.pet import Pet

class PetsApi:

    baseUrl = 'petstore.swagger.io/v1'

    def getStudents(self) -> List[Pet]:
        response = requests.get(f'{baseUrl}/pets')
        return [Pet(**pet) for pet in response.json()]