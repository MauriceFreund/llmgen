package inh.pack.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Car extends Vehicle {

    @JsonProperty("licensePlate")
    private String licensePlate;
    @JsonProperty("vehicleType")
    public static String vehicleType = "CAR";

    public Car() {
    }

    public Car(int id, int price, String licensePlate) {
        super(id, price);
        this.licensePlate = licensePlate;
    }

    public static Car fromJson(String json) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(json, Car.class);
    }

    public String toJson() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(this);
    }

    public String getLicensePlate() {
        return this.licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getVehicleType() {
        return Car.vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        Car.vehicleType = vehicleType;
    }

    public String toString() {
        return "Car{id=" + super.getId() + ", price=" + super.getPrice() + "licensePlate=" + this.licensePlate
                + "vehicleType=" + Car.vehicleType
                + "}";
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (!(obj instanceof Car)) {
            return false;
        }

        Car otherCar = (Car) obj;

        return super.getId() == otherCar.getId()
                && ((this.licensePlate == null && otherCar.licensePlate == null)
                        || (this.licensePlate != null && this.licensePlate.equals(otherCar.licensePlate)))
                && ((this.vehicleType == null && otherCar.vehicleType == null)
                        || (this.vehicleType != null && this.vehicleType.equals(otherCar.vehicleType)));
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (licensePlate != null ? licensePlate.hashCode() : 0);
        result = 31 * result + (vehicleType != null ? vehicleType.hashCode() : 0);
        return result;
    }
}
