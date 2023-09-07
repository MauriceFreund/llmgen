/**
 * This file was auto generated. Do not modify its content.
 *
 * @file Pet
 */

package dx.example.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Pet {

    @JsonProperty("id")
    private int id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("tag")
    private String tag;

    public Pet() { }

    public Pet(int id, String name, String tag) {
        this.id = id;
        this.name = name;
        this.tag = tag;
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
        return "Student{id=" + this.id + ", name=" + this.name + ", tag=" + this.tag + "}";
    }
}
