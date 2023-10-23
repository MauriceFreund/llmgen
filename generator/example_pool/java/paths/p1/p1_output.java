/**
 * This file was auto generated. Do not modify its content.
 *
 * @file ListPetsRequest
 */

package dx.example.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import dx.example.model.Pet;
import dx.example.exception.ApiException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.ArrayList;

public class ListPetsRequest {

    private final HttpClient client;
    private final ObjectMapper mapper;
    private final String baseUrl;

    public ListPetsRequest() {
        client = HttpClient.newHttpClient();
        mapper = new ObjectMapper();
        baseUrl = "petstore.swagger.io/v1";
    }

    public List<Pet> listPets() throws IOException, InterruptedException, ApiException, JsonProcessingException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/pets"))
                .version(HttpClient.Version.HTTP_2)
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        int status = response.statusCode();
        if (status > 299) {
            throw new ApiException("listPets request failed with status code " + status);
        }
        List<Object> jsonNodes = mapper.readValue(response.body(), List.class);
        List<Student> pets = new ArrayList<>();

        for (Object jsonNode : jsonNodes) {
            pets.add(Pet.fromJson(mapper.writeValueAsString(jsonNode)));
        }

        return pets;
    }
}
