package cz.muni.fi.pv243.service;

import javax.ejb.Stateless;

import cz.muni.fi.pv243.model.Author;

@Stateless
public class AuthorService extends AbstractService<Author> {
    public AuthorService() {
        super(Author.class);
    }

    @Override
    public Author findById(Object id) {
        Author author = super.findById(id);
        // force load
        if (author != null && author.getBooks() != null)
            author.getBooks().size();
        return author;
    }
}
