package com.highcliff.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

import com.highcliff.domain.enumeration.Unit;

/**
 * A Parameter.
 */
@Entity
@Table(name = "parameter")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Parameter implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "jhi_min")
    private Double min;

    @Column(name = "jhi_max")
    private Double max;

    @Column(name = "display_precision")
    private Integer displayPrecision;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit")
    private Unit unit;

    @Column(name = "parameter_name")
    private String parameterName;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getMin() {
        return min;
    }

    public Parameter min(Double min) {
        this.min = min;
        return this;
    }

    public void setMin(Double min) {
        this.min = min;
    }

    public Double getMax() {
        return max;
    }

    public Parameter max(Double max) {
        this.max = max;
        return this;
    }

    public void setMax(Double max) {
        this.max = max;
    }

    public Integer getDisplayPrecision() {
        return displayPrecision;
    }

    public Parameter displayPrecision(Integer displayPrecision) {
        this.displayPrecision = displayPrecision;
        return this;
    }

    public void setDisplayPrecision(Integer displayPrecision) {
        this.displayPrecision = displayPrecision;
    }

    public Unit getUnit() {
        return unit;
    }

    public Parameter unit(Unit unit) {
        this.unit = unit;
        return this;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public String getParameterName() {
        return parameterName;
    }

    public Parameter parameterName(String parameterName) {
        this.parameterName = parameterName;
        return this;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
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
        Parameter parameter = (Parameter) o;
        if (parameter.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), parameter.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Parameter{" +
            "id=" + getId() +
            ", min=" + getMin() +
            ", max=" + getMax() +
            ", displayPrecision=" + getDisplayPrecision() +
            ", unit='" + getUnit() + "'" +
            ", parameterName='" + getParameterName() + "'" +
            "}";
    }
}
