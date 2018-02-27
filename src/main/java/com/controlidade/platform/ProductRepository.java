package com.controlidade.platform;

import com.controlidade.platform.entity.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ProductRepository extends PagingAndSortingRepository<Product, Long> {

	@Override
	Product save(@Param("product") Product product);

	@Override
	void delete(@Param("id") Long id);

	@Override
	void delete(@Param("product") Product product);


	@Query("select p from Product p " +
					"where p.expirationDate between ?1 and ?2")
	List<Product> findByExpirationDate(Date from, Date to);

}
