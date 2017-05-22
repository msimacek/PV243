package cz.muni.fi.pv243.service;

import javax.ejb.Stateless;

import cz.muni.fi.pv243.model.Author;

@Stateless
public class AuthorService extends AbstractService<Author> {
    public AuthorService() {
        super(Author.class);
    }
}
