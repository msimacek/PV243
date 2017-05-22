package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.ws.rs.Path;

import cz.muni.fi.pv243.model.Volume;

/**
 * 
 */
@Stateless
@Path("/volumes")
public class VolumeEndpoint extends AbstractEndpoint<Volume> {
}
