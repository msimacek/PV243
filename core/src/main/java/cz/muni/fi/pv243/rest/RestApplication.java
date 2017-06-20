package cz.muni.fi.pv243.rest;

import javax.annotation.security.DeclareRoles;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("/")
@DeclareRoles({ "admin", "checkout", "user" })
public class RestApplication extends Application {
}