package cz.muni.fi.pv243.service;

import javax.ejb.Stateless;

import cz.muni.fi.pv243.model.Volume;

@Stateless
public class VolumeService extends AbstractService<Volume> {
    public VolumeService() {
        super(Volume.class);
    }
}
