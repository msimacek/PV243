package cz.muni.fi.pv243.service;

import javax.ejb.Stateless;
import javax.persistence.NoResultException;

import cz.muni.fi.pv243.model.Volume;

@Stateless
public class VolumeService extends AbstractService<Volume> {
    public VolumeService() {
        super(Volume.class);
    }

    public Volume findByBarcode(Long barcodeId) {
        try {
            return em.createQuery("from Volume where barcodeId = :barcodeId", Volume.class)
                    .setParameter("barcodeId", barcodeId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
