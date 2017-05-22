package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.ws.rs.Path;

import cz.muni.fi.pv243.model.Loan;

/**
 * 
 */
@Stateless
@Path("/loans")
public class LoanEndpoint extends AbstractEndpoint<Loan> {
}
