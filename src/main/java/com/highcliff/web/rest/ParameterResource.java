package com.highcliff.web.rest;
import com.highcliff.domain.Parameter;
import com.highcliff.repository.ParameterRepository;
import com.highcliff.web.rest.errors.BadRequestAlertException;
import com.highcliff.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Parameter.
 */
@RestController
@RequestMapping("/api")
public class ParameterResource {

    private final Logger log = LoggerFactory.getLogger(ParameterResource.class);

    private static final String ENTITY_NAME = "parameter";

    private final ParameterRepository parameterRepository;

    public ParameterResource(ParameterRepository parameterRepository) {
        this.parameterRepository = parameterRepository;
    }

    /**
     * POST  /parameters : Create a new parameter.
     *
     * @param parameter the parameter to create
     * @return the ResponseEntity with status 201 (Created) and with body the new parameter, or with status 400 (Bad Request) if the parameter has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/parameters")
    public ResponseEntity<Parameter> createParameter(@RequestBody Parameter parameter) throws URISyntaxException {
        log.debug("REST request to save Parameter : {}", parameter);
        if (parameter.getId() != null) {
            throw new BadRequestAlertException("A new parameter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Parameter result = parameterRepository.save(parameter);
        return ResponseEntity.created(new URI("/api/parameters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /parameters : Updates an existing parameter.
     *
     * @param parameter the parameter to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated parameter,
     * or with status 400 (Bad Request) if the parameter is not valid,
     * or with status 500 (Internal Server Error) if the parameter couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/parameters")
    public ResponseEntity<Parameter> updateParameter(@RequestBody Parameter parameter) throws URISyntaxException {
        log.debug("REST request to update Parameter : {}", parameter);
        if (parameter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Parameter result = parameterRepository.save(parameter);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, parameter.getId().toString()))
            .body(result);
    }

    /**
     * GET  /parameters : get all the parameters.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of parameters in body
     */
    @GetMapping("/parameters")
    public List<Parameter> getAllParameters() {
        log.debug("REST request to get all Parameters");
        return parameterRepository.findAll();
    }

    /**
     * GET  /parameters/:id : get the "id" parameter.
     *
     * @param id the id of the parameter to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the parameter, or with status 404 (Not Found)
     */
    @GetMapping("/parameters/{id}")
    public ResponseEntity<Parameter> getParameter(@PathVariable Long id) {
        log.debug("REST request to get Parameter : {}", id);
        Optional<Parameter> parameter = parameterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parameter);
    }

    /**
     * DELETE  /parameters/:id : delete the "id" parameter.
     *
     * @param id the id of the parameter to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/parameters/{id}")
    public ResponseEntity<Void> deleteParameter(@PathVariable Long id) {
        log.debug("REST request to delete Parameter : {}", id);
        parameterRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
