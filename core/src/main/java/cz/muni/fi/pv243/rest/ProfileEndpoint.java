package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

import com.fasterxml.jackson.annotation.JsonView;

import cz.muni.fi.pv243.model.User;
import cz.muni.fi.pv243.service.UserService;

@Path("/profile")
@Stateless
public class ProfileEndpoint {
    @Context
    private SecurityContext secContext;

    @Inject
    private UserService userService;

    @GET
    @Produces("application/json")
    @JsonView(User.class)
    public User profile() {
        String email = secContext.getUserPrincipal().getName();
        return userService.findByEmail(email);
    }
}
