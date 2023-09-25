/**
 * This file was auto generated. Do not modify its content.
 *
 * @file Vehicle
 */

package dx.example.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Vehicle {

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
}
