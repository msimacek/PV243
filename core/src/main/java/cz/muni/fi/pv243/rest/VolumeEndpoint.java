package cz.muni.fi.pv243.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.annotation.JsonView;
import com.google.gson.Gson;

import cz.muni.fi.pv243.messaging.EStatus;
import cz.muni.fi.pv243.messaging.JMSMessage;
import cz.muni.fi.pv243.messaging.Sender;
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

    @Inject
    private Sender sender;

    @POST
    @Path("/return")
    public void returnVolume(Volume volume) {
        service.returnVolume(volume.getBarcodeId());
    }


    @Override
    @DELETE
    @Path("/{id:[0-9][0-9]*}")
    @JsonView(Volume.class)
    public Response deleteById(@PathParam("id") Long id) {
        Volume volume = service.findById(id);
        service.delete(volume);
        sendMessage(volume, EStatus.DELETED);

        return Response.noContent().build();
    }

    private void sendMessage(Volume volume, EStatus status) {
        JMSMessage msg = new JMSMessage(volume, status);
        sender.sendMessage(new Gson().toJson(msg));
    }
}
