package com.highcliff.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(name = "hc_observation_parameter")
//@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ObservationParameter extends AbstractAuditingEntity implements Serializable {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Size(max = 50)
    @Column(name = "param_name", length = 50)
    private String name;

    @Size(max = 50)
    @Column(name = "param_value", length = 50)
    private String value;

    @Override
    public String toString() {
        return "Parameter{" +
            ", name='" + name + '\'' +
            ", value='" + value + '\'' +
            "}";
    }
}
