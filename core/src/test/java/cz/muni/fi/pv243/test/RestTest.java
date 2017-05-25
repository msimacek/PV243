package cz.muni.fi.pv243.test;

import static org.junit.Assert.*;

import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.extension.rest.client.ArquillianResteasyResource;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Test;
import org.junit.runner.RunWith;

import cz.muni.fi.pv243.model.Author;
import cz.muni.fi.pv243.model.Book;
import cz.muni.fi.pv243.rest.BookEndpoint;
import cz.muni.fi.pv243.service.BookService;

@RunWith(Arquillian.class)
public class RestTest {
    @Deployment(testable = false)
    public static Archive<?> createDeployment() {
        return ShrinkWrap.create(WebArchive.class, "test.war")
                .addAsResource("test-persistence.xml", "META-INF/persistence.xml")
                .addPackage(Book.class.getPackage())
                .addPackage(BookService.class.getPackage())
                .addPackage(BookEndpoint.class.getPackage())
                .addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml");
    }

    @Test
    @RunAsClient
    public void testCreateBookWithAuthor(@ArquillianResteasyResource("") WebTarget webTarget) throws Exception {
        Author author = new Author();
        author.setName("Foo");
        author.setSurname("Bar");
        Response authorResponse = webTarget
                .path("authors")
                .request(MediaType.APPLICATION_JSON)
                .post(Entity.json(author));
        assertEquals(Response.Status.CREATED.getStatusCode(), authorResponse.getStatus());
        Author outAuthor = authorResponse.readEntity(Author.class);
        Book book = new Book();
        book.setTitle("Book");
        book.setISBN("1234");
        book.getAuthors().add(outAuthor);
        Response bookResponse = webTarget
                .path("books")
                .request(MediaType.APPLICATION_JSON)
                .post(Entity.json(book));
        assertEquals(Response.Status.CREATED.getStatusCode(), bookResponse.getStatus());
        Book outBook = bookResponse.readEntity(Book.class);
        assertNotNull(outBook.getId());

        bookResponse = webTarget
                .path("books/" + outBook.getId())
                .request(MediaType.APPLICATION_JSON)
                .get();
        assertEquals(Response.Status.OK.getStatusCode(), bookResponse.getStatus());
        outBook = bookResponse.readEntity(Book.class);
        assertEquals("Book", outBook.getTitle());
        assertEquals(1, outBook.getAuthors().size());
        assertEquals("Foo", outBook.getAuthors().get(0).getName());
    }
}
