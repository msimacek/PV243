package cz.muni.fi.pv243.test;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

import java.net.URL;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.persistence.CleanupUsingScript;
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
import io.restassured.response.ValidatableResponse;

@RunWith(Arquillian.class)
@CleanupUsingScript("cleanup.sql")
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

    private ValidatableResponse testCreate(String endpoint, JsonObject json) {
        return postJson(endpoint, json)
                .then()
                .statusCode(201)
                .body("id", notNullValue());
    }

    private ValidatableResponse testFind(String endpoint) {
        return getJson(endpoint)
                .then()
                .statusCode(200);
    }

    @Test
    @UsingDataSet("author.yml")
    public void testGetAuthorById() {
        testFind("authors/1")
                .body("name", equalTo("William"))
                .body("surname", equalTo("Shakespeare"));
    }

    @Test
    @ShouldMatchDataSet(value = "author.yml", excludeColumns = "id")
    public void testCreateAuthor() {
        JsonObject author = Json.createObjectBuilder()
                .add("name", "William")
                .add("surname", "Shakespeare")
                .add("bornYear", 1820)
                .add("diedYear", 1860)
                .build();
        testCreate("authors", author);
    }

    @Test
    @UsingDataSet("author.yml")
    @ShouldMatchDataSet(value = { "author.yml", "book.yml" }, excludeColumns = { "id", "books_id" })
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
        testCreate("books", book);
    }

    @Test
    @ShouldMatchDataSet(value = "user.yml", excludeColumns = "id")
    public void testCreateUser() {
        JsonObject user = Json.createObjectBuilder()
                .add("name", "Derp")
                .add("surname", "Derpington")
                .add("email", "derp@derp.me")
                .build();
        testCreate("users", user);
    }

    @Test
    @UsingDataSet("user.yml")
    public void testFindUserByEmail() {
        testFind("users/email/derp@derp.me")
                .body("id", equalTo(1));
    }

    @Test
    @UsingDataSet({ "user.yml", "author.yml", "book.yml" })
    public void testCreateLoan() {
        JsonObject loan = Json.createObjectBuilder()
                .add("user", Json.createObjectBuilder().add("email", "derp@derp.me"))
                .add("volume", Json.createObjectBuilder().add("barcodeId", 789012))
                .build();
        testCreate("loans", loan);
    }
}
