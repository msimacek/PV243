package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import cz.muni.fi.pv243.model.Volume;
import cz.muni.fi.pv243.service.VolumeService;

/**
 * 
 */
@Stateless
@Path("/volumes")
public class VolumeEndpoint extends AbstractEndpoint<Volume> {
    @Inject
    private VolumeService service;

    @POST
    @Path("/return")
    public void returnVolume(Volume volume) {
        service.returnVolume(volume.getBarcodeId());
    }
}
