package com.highcliff.web.rest;

import com.highcliff.HighcliffApp;

import com.highcliff.domain.Parameter;
import com.highcliff.repository.ParameterRepository;
import com.highcliff.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static com.highcliff.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.highcliff.domain.enumeration.Unit;
/**
 * Test class for the ParameterResource REST controller.
 *
 * @see ParameterResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HighcliffApp.class)
public class ParameterResourceIntTest {

    private static final Double DEFAULT_MIN = 1D;
    private static final Double UPDATED_MIN = 2D;

    private static final Double DEFAULT_MAX = 1D;
    private static final Double UPDATED_MAX = 2D;

    private static final Integer DEFAULT_DISPLAY_PRECISION = 1;
    private static final Integer UPDATED_DISPLAY_PRECISION = 2;

    private static final Unit DEFAULT_UNIT = Unit.Kg;
    private static final Unit UPDATED_UNIT = Unit.MM;

    private static final String DEFAULT_PARAMETER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PARAMETER_NAME = "BBBBBBBBBB";

    @Autowired
    private ParameterRepository parameterRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restParameterMockMvc;

    private Parameter parameter;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ParameterResource parameterResource = new ParameterResource(parameterRepository);
        this.restParameterMockMvc = MockMvcBuilders.standaloneSetup(parameterResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parameter createEntity(EntityManager em) {
        Parameter parameter = new Parameter()
            .min(DEFAULT_MIN)
            .max(DEFAULT_MAX)
            .displayPrecision(DEFAULT_DISPLAY_PRECISION)
            .unit(DEFAULT_UNIT)
            .parameterName(DEFAULT_PARAMETER_NAME);
        return parameter;
    }

    @Before
    public void initTest() {
        parameter = createEntity(em);
    }

    @Test
    @Transactional
    public void createParameter() throws Exception {
        int databaseSizeBeforeCreate = parameterRepository.findAll().size();

        // Create the Parameter
        restParameterMockMvc.perform(post("/api/parameters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(parameter)))
            .andExpect(status().isCreated());

        // Validate the Parameter in the database
        List<Parameter> parameterList = parameterRepository.findAll();
        assertThat(parameterList).hasSize(databaseSizeBeforeCreate + 1);
        Parameter testParameter = parameterList.get(parameterList.size() - 1);
        assertThat(testParameter.getMin()).isEqualTo(DEFAULT_MIN);
        assertThat(testParameter.getMax()).isEqualTo(DEFAULT_MAX);
        assertThat(testParameter.getDisplayPrecision()).isEqualTo(DEFAULT_DISPLAY_PRECISION);
        assertThat(testParameter.getUnit()).isEqualTo(DEFAULT_UNIT);
        assertThat(testParameter.getParameterName()).isEqualTo(DEFAULT_PARAMETER_NAME);
    }

    @Test
    @Transactional
    public void createParameterWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = parameterRepository.findAll().size();

        // Create the Parameter with an existing ID
        parameter.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restParameterMockMvc.perform(post("/api/parameters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(parameter)))
            .andExpect(status().isBadRequest());

        // Validate the Parameter in the database
        List<Parameter> parameterList = parameterRepository.findAll();
        assertThat(parameterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllParameters() throws Exception {
        // Initialize the database
        parameterRepository.saveAndFlush(parameter);

        // Get all the parameterList
        restParameterMockMvc.perform(get("/api/parameters?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parameter.getId().intValue())))
            .andExpect(jsonPath("$.[*].min").value(hasItem(DEFAULT_MIN.doubleValue())))
            .andExpect(jsonPath("$.[*].max").value(hasItem(DEFAULT_MAX.doubleValue())))
            .andExpect(jsonPath("$.[*].displayPrecision").value(hasItem(DEFAULT_DISPLAY_PRECISION)))
            .andExpect(jsonPath("$.[*].unit").value(hasItem(DEFAULT_UNIT.toString())))
            .andExpect(jsonPath("$.[*].parameterName").value(hasItem(DEFAULT_PARAMETER_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getParameter() throws Exception {
        // Initialize the database
        parameterRepository.saveAndFlush(parameter);

        // Get the parameter
        restParameterMockMvc.perform(get("/api/parameters/{id}", parameter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(parameter.getId().intValue()))
            .andExpect(jsonPath("$.min").value(DEFAULT_MIN.doubleValue()))
            .andExpect(jsonPath("$.max").value(DEFAULT_MAX.doubleValue()))
            .andExpect(jsonPath("$.displayPrecision").value(DEFAULT_DISPLAY_PRECISION))
            .andExpect(jsonPath("$.unit").value(DEFAULT_UNIT.toString()))
            .andExpect(jsonPath("$.parameterName").value(DEFAULT_PARAMETER_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingParameter() throws Exception {
        // Get the parameter
        restParameterMockMvc.perform(get("/api/parameters/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateParameter() throws Exception {
        // Initialize the database
        parameterRepository.saveAndFlush(parameter);

        int databaseSizeBeforeUpdate = parameterRepository.findAll().size();

        // Update the parameter
        Parameter updatedParameter = parameterRepository.findById(parameter.getId()).get();
        // Disconnect from session so that the updates on updatedParameter are not directly saved in db
        em.detach(updatedParameter);
        updatedParameter
            .min(UPDATED_MIN)
            .max(UPDATED_MAX)
            .displayPrecision(UPDATED_DISPLAY_PRECISION)
            .unit(UPDATED_UNIT)
            .parameterName(UPDATED_PARAMETER_NAME);

        restParameterMockMvc.perform(put("/api/parameters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedParameter)))
            .andExpect(status().isOk());

        // Validate the Parameter in the database
        List<Parameter> parameterList = parameterRepository.findAll();
        assertThat(parameterList).hasSize(databaseSizeBeforeUpdate);
        Parameter testParameter = parameterList.get(parameterList.size() - 1);
        assertThat(testParameter.getMin()).isEqualTo(UPDATED_MIN);
        assertThat(testParameter.getMax()).isEqualTo(UPDATED_MAX);
        assertThat(testParameter.getDisplayPrecision()).isEqualTo(UPDATED_DISPLAY_PRECISION);
        assertThat(testParameter.getUnit()).isEqualTo(UPDATED_UNIT);
        assertThat(testParameter.getParameterName()).isEqualTo(UPDATED_PARAMETER_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingParameter() throws Exception {
        int databaseSizeBeforeUpdate = parameterRepository.findAll().size();

        // Create the Parameter

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParameterMockMvc.perform(put("/api/parameters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(parameter)))
            .andExpect(status().isBadRequest());

        // Validate the Parameter in the database
        List<Parameter> parameterList = parameterRepository.findAll();
        assertThat(parameterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteParameter() throws Exception {
        // Initialize the database
        parameterRepository.saveAndFlush(parameter);

        int databaseSizeBeforeDelete = parameterRepository.findAll().size();

        // Delete the parameter
        restParameterMockMvc.perform(delete("/api/parameters/{id}", parameter.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Parameter> parameterList = parameterRepository.findAll();
        assertThat(parameterList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Parameter.class);
        Parameter parameter1 = new Parameter();
        parameter1.setId(1L);
        Parameter parameter2 = new Parameter();
        parameter2.setId(parameter1.getId());
        assertThat(parameter1).isEqualTo(parameter2);
        parameter2.setId(2L);
        assertThat(parameter1).isNotEqualTo(parameter2);
        parameter1.setId(null);
        assertThat(parameter1).isNotEqualTo(parameter2);
    }
}
