package com.example.chatitbackend.Controllers;

import com.example.chatitbackend.DTOs.WhiteListDTO;
import com.example.chatitbackend.Services.WhiteListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/whitelist")
public class WhiteListController {

    private final WhiteListService whiteListService;

    @Autowired
    public WhiteListController(WhiteListService whiteListService) {
        this.whiteListService = whiteListService;
    }

    @PostMapping("/save")
    public WhiteListDTO saveWhiteList(@RequestBody WhiteListDTO whiteListDTO) {
        return whiteListService.saveWhiteList(whiteListDTO);
    }

    //@CrossOrigin
    @GetMapping("/get-number/{email}")
    public String getNumberByEmail(@PathVariable String email) {
        return whiteListService.getNumberByEmail(email);
    }

    @PutMapping("/update")
    public WhiteListDTO updateWhiteList(@RequestBody WhiteListDTO whiteListDTO) {
        return whiteListService.updateWhiteList(whiteListDTO);
    }
}
