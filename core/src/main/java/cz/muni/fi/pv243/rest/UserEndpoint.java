package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;

import com.fasterxml.jackson.annotation.JsonView;

import cz.muni.fi.pv243.model.DefaultView;
import cz.muni.fi.pv243.model.User;
import cz.muni.fi.pv243.service.UserService;

/**
 * 
 */
@Stateless
@Path("/users")
public class UserEndpoint extends AbstractEndpoint<User> {
    @Inject
    private UserService service;

    @Context
    private SecurityContext securityContext;

    private boolean canAssignRole(String role) {
        switch (role) {
        case "admin":
        case "checkout":
            if (securityContext.isUserInRole("admin"))
                return true;
            break;
        case "user":
            if (securityContext.isUserInRole("admin") || securityContext.isUserInRole("checkout"))
                return true;
        }
        return false;
    }

    @Override
    @POST
    @Consumes("application/json")
    @Produces("application/json")
    @JsonView(DefaultView.class)
    public Response create(@Valid @NotNull User user) {
        if (!canAssignRole(user.getRole()))
            return Response.status(401).build();
        return super.create(user);
    }

    @Override
    @PUT
    @Path("/{id:[0-9][0-9]*}")
    @Consumes("application/json")
    @Produces("application/json")
    public Response update(@PathParam("id") Long id, User user) {
        if (!canAssignRole(user.getRole()))
            return Response.status(401).build();
        return super.update(id, user);
    }

    @Override
    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces("application/json")
    @JsonView(User.class)
    public Response findById(@PathParam("id") Long id) {
        return super.findById(id);
    }

    @GET
    @Path("/email/{email}")
    @Produces("application/json")
    @JsonView(User.class)
    public Response findByEmail(@PathParam("email") String email) {
        User entity = service.findByEmail(email);
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(entity).build();
    }
}
