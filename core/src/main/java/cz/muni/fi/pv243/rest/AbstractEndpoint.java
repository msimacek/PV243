package cz.muni.fi.pv243.rest;

import java.net.URI;
import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;

import com.fasterxml.jackson.annotation.JsonView;

import cz.muni.fi.pv243.service.AbstractService;

/**
 * 
 */
public abstract class AbstractEndpoint<T> {

    @Inject
    private AbstractService<T> service;

    @POST
    @Consumes("application/json")
    @JsonView(DefaultView.class)
    public Response create(@Valid T entity) {
        if (entity == null) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        service.create(entity);
        URI url = UriBuilder.fromResource(getClass()).path(service.getEntityId(entity).toString()).build();
        return Response.created(url).entity(entity).build();
    }

    @DELETE
    @Path("/{id:[0-9][0-9]*}")
    public Response deleteById(@PathParam("id") Long id) {
        T entity = service.findById(id);
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        service.delete(entity);
        return Response.noContent().build();
    }

    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces("application/json")
    @JsonView(DefaultView.class)
    public Response findById(@PathParam("id") Long id) {
        T entity = service.findById(id);
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(entity).build();
    }

    @GET
    @Produces("application/json")
    @JsonView(DefaultView.class)
    public List<T> listAll() {
        final List<T> results = service.findAll();
        return results;
    }

    @PUT
    @Path("/{id:[0-9][0-9]*}")
    @Consumes("application/json")
    public Response update(@PathParam("id") Long id, T entity) {
        if (entity == null) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        if (id == null) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        if (!id.equals(service.getEntityId(entity))) {
            return Response.status(Status.CONFLICT).entity(entity).build();
        }
        if (service.findById(id) == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        service.update(entity);

        return Response.noContent().build();
    }
}
