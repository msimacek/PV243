package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.annotation.JsonView;

import cz.muni.fi.pv243.model.Book;

/**
 * 
 */
@Stateless
@Path("/books")
public class BookEndpoint extends AbstractEndpoint<Book> {
    @Override
    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces("application/json")
    @JsonView(Book.class)
    public Response findById(@PathParam("id") Long id) {
        return super.findById(id);
    }
}
