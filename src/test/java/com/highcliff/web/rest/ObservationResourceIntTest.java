package com.highcliff.web.rest;

import com.highcliff.HighcliffApp;

import com.highcliff.domain.Observation;
import com.highcliff.repository.ObservationRepository;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static com.highcliff.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.highcliff.domain.enumeration.ObservationStatus;
/**
 * Test class for the ObservationResource REST controller.
 *
 * @see ObservationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = HighcliffApp.class)
public class ObservationResourceIntTest {

    private static final ObservationStatus DEFAULT_STATUS = ObservationStatus.Recorded;
    private static final ObservationStatus UPDATED_STATUS = ObservationStatus.Invalid;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final Double DEFAULT_FLOAT_VALUE = 1D;
    private static final Double UPDATED_FLOAT_VALUE = 2D;

    private static final Boolean DEFAULT_BOOLEAN_VALUE = false;
    private static final Boolean UPDATED_BOOLEAN_VALUE = true;

    private static final Integer DEFAULT_INT_VALUE = 1;
    private static final Integer UPDATED_INT_VALUE = 2;

    private static final String DEFAULT_STRING_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_STRING_VALUE = "BBBBBBBBBB";

    private static final Instant DEFAULT_RECORDED_WHEN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_RECORDED_WHEN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private ObservationRepository observationRepository;

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

    private MockMvc restObservationMockMvc;

    private Observation observation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ObservationResource observationResource = new ObservationResource(observationRepository);
        this.restObservationMockMvc = MockMvcBuilders.standaloneSetup(observationResource)
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
    public static Observation createEntity(EntityManager em) {
        Observation observation = new Observation()
            .status(DEFAULT_STATUS)
            .comment(DEFAULT_COMMENT)
            .floatValue(DEFAULT_FLOAT_VALUE)
            .booleanValue(DEFAULT_BOOLEAN_VALUE)
            .intValue(DEFAULT_INT_VALUE)
            .stringValue(DEFAULT_STRING_VALUE)
            .recordedWhen(DEFAULT_RECORDED_WHEN);
        return observation;
    }

    @Before
    public void initTest() {
        observation = createEntity(em);
    }

    @Test
    @Transactional
    public void createObservation() throws Exception {
        int databaseSizeBeforeCreate = observationRepository.findAll().size();

        // Create the Observation
        restObservationMockMvc.perform(post("/api/observations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(observation)))
            .andExpect(status().isCreated());

        // Validate the Observation in the database
        List<Observation> observationList = observationRepository.findAll();
        assertThat(observationList).hasSize(databaseSizeBeforeCreate + 1);
        Observation testObservation = observationList.get(observationList.size() - 1);
        assertThat(testObservation.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testObservation.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testObservation.getFloatValue()).isEqualTo(DEFAULT_FLOAT_VALUE);
        assertThat(testObservation.isBooleanValue()).isEqualTo(DEFAULT_BOOLEAN_VALUE);
        assertThat(testObservation.getIntValue()).isEqualTo(DEFAULT_INT_VALUE);
        assertThat(testObservation.getStringValue()).isEqualTo(DEFAULT_STRING_VALUE);
        assertThat(testObservation.getRecordedWhen()).isEqualTo(DEFAULT_RECORDED_WHEN);
    }

    @Test
    @Transactional
    public void createObservationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = observationRepository.findAll().size();

        // Create the Observation with an existing ID
        observation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restObservationMockMvc.perform(post("/api/observations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(observation)))
            .andExpect(status().isBadRequest());

        // Validate the Observation in the database
        List<Observation> observationList = observationRepository.findAll();
        assertThat(observationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllObservations() throws Exception {
        // Initialize the database
        observationRepository.saveAndFlush(observation);

        // Get all the observationList
        restObservationMockMvc.perform(get("/api/observations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(observation.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())))
            .andExpect(jsonPath("$.[*].floatValue").value(hasItem(DEFAULT_FLOAT_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].booleanValue").value(hasItem(DEFAULT_BOOLEAN_VALUE.booleanValue())))
            .andExpect(jsonPath("$.[*].intValue").value(hasItem(DEFAULT_INT_VALUE)))
            .andExpect(jsonPath("$.[*].stringValue").value(hasItem(DEFAULT_STRING_VALUE.toString())))
            .andExpect(jsonPath("$.[*].recordedWhen").value(hasItem(DEFAULT_RECORDED_WHEN.toString())));
    }
    
    @Test
    @Transactional
    public void getObservation() throws Exception {
        // Initialize the database
        observationRepository.saveAndFlush(observation);

        // Get the observation
        restObservationMockMvc.perform(get("/api/observations/{id}", observation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(observation.getId().intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()))
            .andExpect(jsonPath("$.floatValue").value(DEFAULT_FLOAT_VALUE.doubleValue()))
            .andExpect(jsonPath("$.booleanValue").value(DEFAULT_BOOLEAN_VALUE.booleanValue()))
            .andExpect(jsonPath("$.intValue").value(DEFAULT_INT_VALUE))
            .andExpect(jsonPath("$.stringValue").value(DEFAULT_STRING_VALUE.toString()))
            .andExpect(jsonPath("$.recordedWhen").value(DEFAULT_RECORDED_WHEN.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingObservation() throws Exception {
        // Get the observation
        restObservationMockMvc.perform(get("/api/observations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateObservation() throws Exception {
        // Initialize the database
        observationRepository.saveAndFlush(observation);

        int databaseSizeBeforeUpdate = observationRepository.findAll().size();

        // Update the observation
        Observation updatedObservation = observationRepository.findById(observation.getId()).get();
        // Disconnect from session so that the updates on updatedObservation are not directly saved in db
        em.detach(updatedObservation);
        updatedObservation
            .status(UPDATED_STATUS)
            .comment(UPDATED_COMMENT)
            .floatValue(UPDATED_FLOAT_VALUE)
            .booleanValue(UPDATED_BOOLEAN_VALUE)
            .intValue(UPDATED_INT_VALUE)
            .stringValue(UPDATED_STRING_VALUE)
            .recordedWhen(UPDATED_RECORDED_WHEN);

        restObservationMockMvc.perform(put("/api/observations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedObservation)))
            .andExpect(status().isOk());

        // Validate the Observation in the database
        List<Observation> observationList = observationRepository.findAll();
        assertThat(observationList).hasSize(databaseSizeBeforeUpdate);
        Observation testObservation = observationList.get(observationList.size() - 1);
        assertThat(testObservation.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testObservation.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testObservation.getFloatValue()).isEqualTo(UPDATED_FLOAT_VALUE);
        assertThat(testObservation.isBooleanValue()).isEqualTo(UPDATED_BOOLEAN_VALUE);
        assertThat(testObservation.getIntValue()).isEqualTo(UPDATED_INT_VALUE);
        assertThat(testObservation.getStringValue()).isEqualTo(UPDATED_STRING_VALUE);
        assertThat(testObservation.getRecordedWhen()).isEqualTo(UPDATED_RECORDED_WHEN);
    }

    @Test
    @Transactional
    public void updateNonExistingObservation() throws Exception {
        int databaseSizeBeforeUpdate = observationRepository.findAll().size();

        // Create the Observation

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restObservationMockMvc.perform(put("/api/observations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(observation)))
            .andExpect(status().isBadRequest());

        // Validate the Observation in the database
        List<Observation> observationList = observationRepository.findAll();
        assertThat(observationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteObservation() throws Exception {
        // Initialize the database
        observationRepository.saveAndFlush(observation);

        int databaseSizeBeforeDelete = observationRepository.findAll().size();

        // Delete the observation
        restObservationMockMvc.perform(delete("/api/observations/{id}", observation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Observation> observationList = observationRepository.findAll();
        assertThat(observationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Observation.class);
        Observation observation1 = new Observation();
        observation1.setId(1L);
        Observation observation2 = new Observation();
        observation2.setId(observation1.getId());
        assertThat(observation1).isEqualTo(observation2);
        observation2.setId(2L);
        assertThat(observation1).isNotEqualTo(observation2);
        observation1.setId(null);
        assertThat(observation1).isNotEqualTo(observation2);
    }
}
