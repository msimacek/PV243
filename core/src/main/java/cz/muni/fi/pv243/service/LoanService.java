package cz.muni.fi.pv243.service;

import javax.ejb.Stateless;

import cz.muni.fi.pv243.model.Loan;

@Stateless
public class LoanService extends AbstractService<Loan> {
    public LoanService() {
        super(Loan.class);
    }
}
