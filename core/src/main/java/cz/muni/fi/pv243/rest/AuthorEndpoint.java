package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.ws.rs.Path;

import cz.muni.fi.pv243.model.Author;

/**
 * 
 */
@Stateless
@Path("/authors")
public class AuthorEndpoint extends AbstractEndpoint<Author> {
}
