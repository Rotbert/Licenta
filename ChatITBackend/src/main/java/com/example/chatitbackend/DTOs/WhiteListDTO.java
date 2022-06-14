package com.example.chatitbackend.DTOs;

import lombok.Data;

import java.util.Date;

@Data
public class WhiteListDTO {

    private Integer id;
    private String name;
    private String email;
    private String numberOfOffensiveWords;
    private Date creationDate;
}
