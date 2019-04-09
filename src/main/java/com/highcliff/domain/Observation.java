package com.highcliff.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

import com.highcliff.domain.enumeration.ObservationStatus;

/**
 * A Observation.
 */
@Entity
@Table(name = "observation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Observation implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ObservationStatus status;

    @Column(name = "jhi_comment")
    private String comment;

    @Column(name = "float_value")
    private Double floatValue;

    @Column(name = "boolean_value")
    private Boolean booleanValue;

    @Column(name = "int_value")
    private Integer intValue;

    @Column(name = "string_value")
    private String stringValue;

    @Column(name = "recorded_when")
    private Instant recordedWhen;

    @ManyToOne
    @JsonIgnoreProperties("observations")
    private Parameter parameter;

    @ManyToOne
    @JsonIgnoreProperties("observations")
    private Record record;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ObservationStatus getStatus() {
        return status;
    }

    public Observation status(ObservationStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ObservationStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public Observation comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Double getFloatValue() {
        return floatValue;
    }

    public Observation floatValue(Double floatValue) {
        this.floatValue = floatValue;
        return this;
    }

    public void setFloatValue(Double floatValue) {
        this.floatValue = floatValue;
    }

    public Boolean isBooleanValue() {
        return booleanValue;
    }

    public Observation booleanValue(Boolean booleanValue) {
        this.booleanValue = booleanValue;
        return this;
    }

    public void setBooleanValue(Boolean booleanValue) {
        this.booleanValue = booleanValue;
    }

    public Integer getIntValue() {
        return intValue;
    }

    public Observation intValue(Integer intValue) {
        this.intValue = intValue;
        return this;
    }

    public void setIntValue(Integer intValue) {
        this.intValue = intValue;
    }

    public String getStringValue() {
        return stringValue;
    }

    public Observation stringValue(String stringValue) {
        this.stringValue = stringValue;
        return this;
    }

    public void setStringValue(String stringValue) {
        this.stringValue = stringValue;
    }

    public Instant getRecordedWhen() {
        return recordedWhen;
    }

    public Observation recordedWhen(Instant recordedWhen) {
        this.recordedWhen = recordedWhen;
        return this;
    }

    public void setRecordedWhen(Instant recordedWhen) {
        this.recordedWhen = recordedWhen;
    }

    public Parameter getParameter() {
        return parameter;
    }

    public Observation parameter(Parameter parameter) {
        this.parameter = parameter;
        return this;
    }

    public void setParameter(Parameter parameter) {
        this.parameter = parameter;
    }

    public Record getRecord() {
        return record;
    }

    public Observation record(Record record) {
        this.record = record;
        return this;
    }

    public void setRecord(Record record) {
        this.record = record;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Observation observation = (Observation) o;
        if (observation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), observation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Observation{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", comment='" + getComment() + "'" +
            ", floatValue=" + getFloatValue() +
            ", booleanValue='" + isBooleanValue() + "'" +
            ", intValue=" + getIntValue() +
            ", stringValue='" + getStringValue() + "'" +
            ", recordedWhen='" + getRecordedWhen() + "'" +
            "}";
    }
}
