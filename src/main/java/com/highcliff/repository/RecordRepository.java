package com.highcliff.repository;

import com.highcliff.domain.Record;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Record entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {

    @Query("select record from Record record where record.userId.login = ?#{principal.username}")
    List<Record> findByUserIdIsCurrentUser();

}
