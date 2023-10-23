/**
 * This file was auto generated. Do not modify its content.
 *
 * @file Pet
 */

package dx.example.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

/**
 * Represents a pet
 */
public class Pet {

    @JsonProperty("id")
    private int id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("tag")
    private String tag;

    public Pet() {
    }

    public Pet(int id, String name, String tag) {
        this.id = id;
        this.name = name;
        this.tag = tag;
    }

    public static Pet fromJson(String json) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(json, Pet.class);
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

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTag() {
        return this.tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String toString() {
        return "Pet{id=" + this.id + ", name=" + this.name + ", tag=" + this.tag + "}";
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (!(obj instanceof Pet)) {
            return false;
        }

        Pet otherPet = (Pet) obj;

        return this.id == otherPet.id
                && ((this.name == null && otherPet.name == null) || (this.name != null && this.name.equals(otherPet.name)))
                && ((this.tag == null && otherPet.tag == null) || (this.tag != null && this.tag.equals(otherPet.tagId)));
    }

    @Override
    public int hashCode() {
        int result = Integer.hashCode(id);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (tag != null ? tag.hashCode() : 0);
        return result;
    }
}
