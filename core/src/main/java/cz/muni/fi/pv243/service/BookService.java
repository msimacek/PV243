package cz.muni.fi.pv243.service;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;

import cz.muni.fi.pv243.model.Author;
import cz.muni.fi.pv243.model.Book;
import cz.muni.fi.pv243.model.Volume;

@Stateless
public class BookService extends AbstractService<Book> {
    @Inject
    private AuthorService authorService;

    @Inject
    private VolumeService volumeService;

    public BookService() {
        super(Book.class);
    }

    private void processAuthors(Book book) {
        if (book.getAuthors() == null)
            return;
        List<Author> newAuthors = new ArrayList<>(book.getAuthors().size());
        for (Author authorDesc : book.getAuthors()) {
            Author author = authorService.findById(authorDesc.getId());
            if (author == null)
                throw new ServiceException("Author not found (id=" + authorDesc.getId() + ")");
            newAuthors.add(author);
        }
        book.setAuthors(newAuthors);
    }

    private void processVolumes(Book book) {
        if (book.getVolumes() == null)
            return;
        for (Volume volume : book.getVolumes()) {
            volume.setBook(book);
            volumeService.create(volume);
        }
    }

    @Override
    public void create(Book book) {
        processAuthors(book);
        super.create(book);
        processVolumes(book);
    }

    @Override
    public Book findById(Object id) {
        Book book = super.findById(id);
        // force load
        if (book != null && book.getVolumes() != null)
            book.getVolumes().size();
        return book;
    }
}
