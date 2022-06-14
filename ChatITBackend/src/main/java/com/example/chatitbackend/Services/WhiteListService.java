package com.example.chatitbackend.Services;

import com.example.chatitbackend.DTOs.WhiteListDTO;
import com.example.chatitbackend.Entities.WhiteList;
import com.example.chatitbackend.Repositories.WhiteListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WhiteListService {

    private final WhiteListRepository whiteListRepository;

    @Autowired
    public WhiteListService(WhiteListRepository whiteListRepository) {
        this.whiteListRepository = whiteListRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public WhiteListDTO saveWhiteList(WhiteListDTO whiteListDTO) {

        WhiteList whiteList = new WhiteList();

        whiteList.setId(whiteListDTO.getId());
        whiteList.setName(whiteListDTO.getName());
        whiteList.setEmail(whiteListDTO.getEmail());
        whiteList.setNumberOfOffensiveMessages(whiteListDTO.getNumberOfOffensiveMessages());
        whiteList.setCreationDate(whiteListDTO.getCreationDate());

        WhiteList savedWhiteList = whiteListRepository.save(whiteList);

        WhiteListDTO whiteListDTO1 = new WhiteListDTO();

        whiteListDTO1.setId(savedWhiteList.getId());
        whiteListDTO1.setName(savedWhiteList.getName());
        whiteListDTO1.setEmail(savedWhiteList.getEmail());
        whiteListDTO1.setNumberOfOffensiveMessages(savedWhiteList.getNumberOfOffensiveMessages());
        whiteListDTO1.setCreationDate(savedWhiteList.getCreationDate());

        return whiteListDTO1;
    }
    
    public WhiteListDTO updateWhiteList(WhiteListDTO whiteListDTO) {

        WhiteList oldWhiteList = new WhiteList();
        String email = whiteListDTO.getEmail();
        List<WhiteList> whiteListList = (List<WhiteList>) whiteListRepository.findAll();

        for (WhiteList whiteList : whiteListList) {
            if(whiteList.getEmail().equals(email)){
                oldWhiteList = whiteListRepository.findById(whiteList.getId()).get();

                oldWhiteList.setNumberOfOffensiveMessages(whiteListDTO.getNumberOfOffensiveMessages());
                whiteListRepository.save(oldWhiteList);
                break;
            }
        }

        return whiteListDTO;
    }

    public String getNumberByEmail(String email) {

        List<WhiteList> whiteListList = (List<WhiteList>) whiteListRepository.findAll();

        for (WhiteList whiteList : whiteListList) {
            if(whiteList.getEmail().equals(email)){
                return whiteList.getNumberOfOffensiveMessages();
            }
        }
        return "";
    }

}
