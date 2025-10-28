package MaziSheti.Repository;

import MaziSheti.ProductCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCatalogRepository extends JpaRepository<ProductCatalog, Long> {

    // Get products by category
    List<ProductCatalog> findByProductType(String productType);

    // Get products by vendor ID
    List<ProductCatalog> findByVendor_Id(Long vendorId);

    // Get all distinct product categories
    @Query("SELECT DISTINCT p.productType FROM ProductCatalog p")
    List<String> findDistinctProductTypes();
}
