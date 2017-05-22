package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.ws.rs.Path;

import cz.muni.fi.pv243.model.User;

/**
 * 
 */
@Stateless
@Path("/users")
public class UserEndpoint extends AbstractEndpoint<User> {
}
