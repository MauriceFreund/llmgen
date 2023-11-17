package model.vehicles.model;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * The base class of all vehicles
 */
public class Vehicle {

    private static Map<String, Function<String, ? extends Vehicle>> factories = new HashMap<>();

    @JsonProperty("id")
    private int id;
    @JsonProperty("price")
    private int price;

    public Vehicle() {
    }

    public Vehicle(int id, int price) {
        this.id = id;
        this.price = price;
    }

    public static Vehicle fromJson(String json) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(json);
        String vehicleType = jsonNode.get("vehicleType").asText();
        if (vehicleType != "") {
            return factories.get(vehicleType).apply(json);
        }
        return objectMapper.readValue(json, Vehicle.class);
    }

    public String toJson() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(this);
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPrice() {
        return this.price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String toString() {
        return "Vehicle{id=" + this.id + ", price=" + this.price + "}";
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (!(obj instanceof Vehicle)) {
            return false;
        }

        Vehicle otherVehicle = (Vehicle) obj;

        return this.id == otherVehicle.id
                && this.price == otherVehicle.price;
    }

    @Override
    public int hashCode() {
        int result = Integer.hashCode(id);
        result = 31 * result + Integer.hashCode(price);
        return result;
    }

    public static void registerFactory(String vehicleType, Function<String, Vehicle> factoryFunction) {
        factories.put(vehicleType, factoryFunction);
    }

    static {
        Vehicle.registerFactory(Car.vehicleType, json -> {
            try {
                return Car.fromJson(json);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });
        Vehicle.registerFactory(Boat.vehicleType, json -> {
            try {
                return Boat.fromJson(json);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });
    }
}
