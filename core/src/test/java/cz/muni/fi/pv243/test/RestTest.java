package cz.muni.fi.pv243.test;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

import java.net.URL;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.persistence.ShouldMatchDataSet;
import org.jboss.arquillian.persistence.UsingDataSet;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.jboss.shrinkwrap.resolver.api.maven.PomEquippedResolveStage;
import org.junit.Test;
import org.junit.runner.RunWith;

import cz.muni.fi.pv243.model.Book;
import cz.muni.fi.pv243.rest.BookEndpoint;
import cz.muni.fi.pv243.service.BookService;
import io.restassured.response.Response;

@RunWith(Arquillian.class)
public class RestTest {
    @ArquillianResource
    URL basePath;

    @Deployment
    public static Archive<?> createDeployment() {
        PomEquippedResolveStage resolver = Maven.resolver().loadPomFromFile("pom.xml");
        return ShrinkWrap.create(WebArchive.class, "test.war")
                .addAsResource("test-persistence.xml", "META-INF/persistence.xml")
                .addPackage(Book.class.getPackage())
                .addPackage(BookService.class.getPackage())
                .addPackage(BookEndpoint.class.getPackage())
                .addAsLibraries(resolver.resolve("io.rest-assured:rest-assured").withTransitivity().asFile())
                .addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml");
    }

    private Response getJson(String endpoint) {
        return given()
                .accept("application/json")
                .get(basePath + endpoint);
    }

    private Response postJson(String endpoint, JsonObject json) {
        return given()
                .accept("application/json")
                .contentType("application/json")
                .body(json.toString())
                .post(basePath + endpoint);
    }

    @Test
    @UsingDataSet("sample-author.yml")
    public void testGetAuthorById() {
        getJson("authors/1")
                .then()
                .statusCode(200)
                .body("name", equalTo("William"))
                .body("surname", equalTo("Shakespeare"));
    }

    @Test
    @ShouldMatchDataSet(value = "sample-author.yml", excludeColumns = "author.id")
    public void testCreateAuthor() {
        JsonObject json = Json.createObjectBuilder()
                .add("name", "William")
                .add("surname", "Shakespeare")
                .add("bornYear", 1820)
                .add("diedYear", 1860)
                .build();
        postJson("authors", json)
                .then()
                .statusCode(201)
                .body("id", notNullValue());
    }

    @Test
    @UsingDataSet("sample-author.yml")
    @ShouldMatchDataSet(value = { "sample-author.yml", "sample-book.yml" }, excludeColumns = { "book.id",
            "book_author.books_id" })
    public void testCreateBook() {
        JsonArray authors = Json.createArrayBuilder()
                .add(Json.createObjectBuilder().add("id", 1).build())
                .build();
        JsonArray volumes = Json.createArrayBuilder()
                .add(Json.createObjectBuilder().add("barcodeId", 123456).build())
                .add(Json.createObjectBuilder().add("barcodeId", 789012).build())
                .build();
        JsonObject book = Json.createObjectBuilder()
                .add("title", "Hamlet")
                .add("isbn", "1234-5678")
                .add("authors", authors)
                .add("volumes", volumes)
                .build();
        postJson("books", book)
                .then()
                .statusCode(201)
                .body("id", notNullValue());
    }
}
