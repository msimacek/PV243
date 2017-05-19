package cz.muni.fi.pv243.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.OptimisticLockException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;

import cz.muni.fi.pv243.model.Author;
import cz.muni.fi.pv243.model.Book;

/**
 * 
 */
@Stateless
@Path("/books")
public class BookEndpoint {
    @PersistenceContext(unitName = "pv243-persistence-unit")
    private EntityManager em;

    private void processAuthors(Book book) {
        if (book.getAuthors() == null)
            return;
        List<Author> newAuthors = new ArrayList<>(book.getAuthors().size());
        for (Author authorDesc : book.getAuthors()) {
            Author author = em.find(Author.class, authorDesc.getId());
            if (author != null) {
                newAuthors.add(author);
            }
        }
        book.setAuthors(newAuthors);
    }

    @POST
    @Consumes("application/json")
    public Response create(@Valid Book entity) {
        processAuthors(entity);
        em.persist(entity);
        return Response
                .created(UriBuilder.fromResource(BookEndpoint.class).path(String.valueOf(entity.getId())).build())
                .build();
    }

    @DELETE
    @Path("/{id:[0-9][0-9]*}")
    public Response deleteById(@PathParam("id") Long id) {
        Book entity = em.find(Book.class, id);
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        em.remove(entity);
        return Response.noContent().build();
    }

    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces("application/json")
    public Response findById(@PathParam("id") Long id) {
        TypedQuery<Book> findByIdQuery = em.createQuery(
                "SELECT b FROM Book b LEFT JOIN FETCH b.authors WHERE b.id = :entityId ORDER BY b.id", Book.class);
        findByIdQuery.setParameter("entityId", id);
        Book entity;
        try {
            entity = findByIdQuery.getSingleResult();
        } catch (NoResultException nre) {
            entity = null;
        }
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(entity).build();
    }

    @GET
    @Produces("application/json")
    public List<Book> listAll(@QueryParam("start") Integer startPosition, @QueryParam("max") Integer maxResult) {
        TypedQuery<Book> findAllQuery = em.createQuery("SELECT b FROM Book b LEFT JOIN FETCH b.authors ORDER BY b.id",
                Book.class);
        if (startPosition != null) {
            findAllQuery.setFirstResult(startPosition);
        }
        if (maxResult != null) {
            findAllQuery.setMaxResults(maxResult);
        }
        final List<Book> results = findAllQuery.getResultList();
        return results;
    }

    @PUT
    @Path("/{id:[0-9][0-9]*}")
    @Consumes("application/json")
    public Response update(@PathParam("id") Long id, Book entity) {
        if (entity == null) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        if (id == null) {
            return Response.status(Status.BAD_REQUEST).build();
        }
        if (!id.equals(entity.getId())) {
            return Response.status(Status.CONFLICT).entity(entity).build();
        }
        if (em.find(Book.class, id) == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        try {
            entity = em.merge(entity);
        } catch (OptimisticLockException e) {
            return Response.status(Response.Status.CONFLICT).entity(e.getEntity()).build();
        }

        return Response.noContent().build();
    }
}
