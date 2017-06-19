package cz.muni.fi.pv243.service;

import java.sql.Date;
import java.util.Calendar;

import javax.ejb.Stateless;
import javax.persistence.NoResultException;

import cz.muni.fi.pv243.model.Loan;
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

    public void returnVolume(Long barcodeId) {
        Volume volume = findByBarcode(barcodeId);
        if (volume == null)
            throw new ServiceException("Volume not found");
        for (Loan loan : volume.getLoans()) {
            if (loan.getReturnDate() == null) {
                loan.setReturnDate(new Date(Calendar.getInstance().getTimeInMillis()));
                return;
            }
        }
        throw new ServiceException("No loan found for volume");
    }
}
