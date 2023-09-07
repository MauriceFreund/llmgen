/**
 * This file was auto generated. Do not modify its content.
 *
 * @file ListPetsRequest
 */

package dx.example.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dx.example.model.Pet;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

public class ListPetsRequest {

    private final HttpClient client;
    private final ObjectMapper mapper;
    private final String baseUrl;

    public ListPetsRequest() {
        client = HttpClient.newHttpClient();
        mapper = new ObjectMapper();
        baseUrl = "petstore.swagger.io/v1";
    }

    public List<Pet> listPets() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/pets"))
                .version(HttpClient.Version.HTTP_2)
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        TypeReference<List<Pet>> listType = new TypeReference<List<Pet>>() {
        };
        return mapper.readValue(response.body(), listType);
    }
}
