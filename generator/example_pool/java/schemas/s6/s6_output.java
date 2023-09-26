/**
 * This file was auto generated. Do not modify its content.
 *
 * @file Car
 */

package inh.pack.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * The Car class
 */
public class Car extends Vehicle {

    @JsonProperty("licensePlate")
    private String licensePlate;
    @JsonProperty("vehicleType")
    private String vehicleType;

    public Car() {
    }
    
    public Car(int id, String licensePlate) {
        super(id);
        this.licensePlate = licensePlate;
        this.vehicleType = "CAR";
    }

    public String getLicensePlate() {
        return this.licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }
    
    public String getVehicleType() {
        return this.vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String toString() {
        return "Car{id=" + super.getId() + ", licensePlate=" + this.licensePlate + "vehicleType=" + this.vehicleType + "}";
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
            && ((this.licensePlate == null && otherCar.licensePlate == null) || (this.licensePlate != null && this.licensePlate.equals(otherCar.licensePlate))) 
            && ((this.vehicleType == null && otherCar.vehicleType == null) || (this.vehicleType != null && this.vehicleType.equals(otherCar.vehicleType)));
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (licensePlate != null ? licensePlate.hashCode() : 0);
        result = 31 * result + (vehicleType != null ? vehicleType.hashCode() : 0);
        return result;
    }
}
