package com.controlidade.platform;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

  private final EmployeeRepository employees;
  private final ManagerRepository managers;
  private final ProductRepository products;

  @Autowired
  public DatabaseLoader(EmployeeRepository employeeRepository,
                        ManagerRepository managerRepository, ProductRepository products) {

    this.employees = employeeRepository;
    this.managers = managerRepository;
    this.products = products;
  }

  @Override
  public void run(String... strings) throws Exception {


    Manager bruno = this.managers.findByName("bruno");
    if(bruno == null){
      this.managers.save(new Manager("bruno", "test",
              "ROLE_MANAGER"));
    }
    Manager gi = this.managers.findByName("gi");
    if(gi == null){
      this.managers.save(new Manager("gi", "gi_abc1",
              "ROLE_MANAGER"));
    }
    Manager jess = this.managers.findByName("jess");
    if(jess == null){
      this.managers.save(new Manager("jess", "jess_def1",
              "ROLE_MANAGER"));
    }

    long DAY_IN_MS = 1000 * 60 * 60 * 24;

//    this.products.save(new Product("product A", "12312", "Grains", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product B", "45645", "Grains", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product C", "345", "Grains", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product D", "6767", "Grains", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product E", "1232", "Grains", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product F", "8989", "Frozen", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product G", "345", "Frozen", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product H", "454", "Frozen", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product I", "57656", "Frozen", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product J", "6767", "Frozen", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product L", "7878", "Frozen", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product M", "4545", "Capsules", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product N", "2332", "Capsules", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product O", "1231245", "Capsules", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product P", "34566", "Capsules", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product Q", "34546", "Capsules", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product R", "6767", "Capsules", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product S", "7878", "Capsules", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product T", "3434", "Organic", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product U", "6767", "Organic", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product V", "2323", "Organic", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));
//    this.products.save(new Product("product X", "7878", "Organic", new Timestamp(new Date().getTime()), new Timestamp(new Date().getTime() - (7 * DAY_IN_MS)), "dist"));


    SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken("bruno", "doesn't matter",
                    AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

    SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken("fius", "doesn't matter",
                    AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

    SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken("gi", "doesn't matter",
                    AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

    SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken("jess", "doesn't matter",
                    AuthorityUtils.createAuthorityList("ROLE_MANAGER")));

    SecurityContextHolder.clearContext();
  }
}
// end::code[]