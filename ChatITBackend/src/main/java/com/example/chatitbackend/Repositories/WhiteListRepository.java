package com.example.chatitbackend.Repositories;

import com.example.chatitbackend.Entities.WhiteList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface WhiteListRepository extends JpaRepository<WhiteList, Integer> {

}
