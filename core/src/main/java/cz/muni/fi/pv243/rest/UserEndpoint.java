package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fasterxml.jackson.annotation.JsonView;

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

    @GET
    @Path("/email/{email}")
    @Produces("application/json")
    @JsonView(DefaultView.class)
    public Response findByEmail(@PathParam("email") String email) {
        User entity = service.findByEmail(email);
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(entity).build();
    }
}
