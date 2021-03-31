package com.trainer.service;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trainer.model.Solution;
import com.trainer.schema.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SchemaService {

    @Autowired
    private ObjectMapper objectMapper;

    public Schema getSolutionSchema(Solution solution) {
        try {
            return objectMapper.readValue(solution.getData(), Schema.class);
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
