package cz.muni.fi.pv243.db;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

import cz.muni.fi.pv243.model.User;
import cz.muni.fi.pv243.service.UserService;

@Startup
@Singleton
public class DataInitializer {
    @Inject
    private UserService service;

    @PostConstruct
    public void init() {
        if (service.findAll().size() == 0) {
            User user = new User();
            user.setName("admin");
            user.setSurname("admin");
            user.setEmail("admin@example.com");
            user.setPassword("1234");
            user.setRole("admin");
            service.create(user);
        }
    }

}
