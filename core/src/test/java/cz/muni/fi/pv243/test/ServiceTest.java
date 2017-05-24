package cz.muni.fi.pv243.test;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.UserTransaction;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Test;
import org.junit.runner.RunWith;

import cz.muni.fi.pv243.model.Author;
import cz.muni.fi.pv243.model.Book;
import cz.muni.fi.pv243.service.BookService;

@RunWith(Arquillian.class)
public class ServiceTest {
    @Deployment
    public static Archive<?> createDeployment() {
        return ShrinkWrap.create(WebArchive.class, "test.war")
                .addAsResource("test-persistence.xml", "META-INF/persistence.xml")
                .addPackage(Book.class.getPackage())
                .addPackage(BookService.class.getPackage())
                .addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml");
    }

    @PersistenceContext
    private EntityManager em;

    @Inject
    UserTransaction tx;

    @Inject
    private BookService bookService;

    @Test
    public void testCreateBook() throws Exception {
        tx.begin();
        Author author = new Author();
        author.setName("Foo");
        author.setSurname("Bar");
        em.persist(author);
        Book book = new Book();
        Author inAuthor = new Author();
        inAuthor.setId(author.getId());
        List<Author> authors = new ArrayList<>();
        authors.add(inAuthor);
        book.setTitle("Book");
        book.setISBN("1234");
        book.setAuthors(authors);
        bookService.create(book);
        tx.commit();
        assertNotNull(book.getId());
        assertEquals(1, book.getAuthors().size());
        assertSame(author, book.getAuthors().get(0));
    }
}
