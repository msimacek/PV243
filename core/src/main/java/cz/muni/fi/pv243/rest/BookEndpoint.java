package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.ws.rs.Path;

import cz.muni.fi.pv243.model.Book;

/**
 * 
 */
@Stateless
@Path("/books")
public class BookEndpoint extends AbstractEndpoint<Book> {
}
