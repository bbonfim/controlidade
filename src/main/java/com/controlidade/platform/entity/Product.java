package com.controlidade.platform.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;
import java.sql.Timestamp;
import java.util.Date;

@Data
@Entity
public class Product {

  private
  @Id
  @GeneratedValue
  Long id;
  private String code;
  private String name;
  private String category;
  @JsonFormat(pattern = "dd/MM/yyyy")
  private Date manufactureDate;
  @JsonFormat(pattern = "dd/MM/yyyy")
  private Date expirationDate;
  private String distributor;
  private Integer quantity;
  private String tag;

  private
  @Version
  @JsonIgnore
  Long version;


  private Product() {
  }

  public Product(String code, String name, String category, Timestamp manufactureDate, Timestamp expirationDate, String distributor) {
    this.code = code;
    this.name = name;
    this.category = category;
    this.manufactureDate = manufactureDate;
    this.expirationDate = expirationDate;
    this.distributor = distributor;
  }
}
// end::code[]