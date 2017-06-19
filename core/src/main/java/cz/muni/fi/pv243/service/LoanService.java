package cz.muni.fi.pv243.service;

import java.sql.Date;
import java.util.Calendar;

import javax.ejb.Stateless;
import javax.inject.Inject;

import cz.muni.fi.pv243.model.Loan;
import cz.muni.fi.pv243.model.User;
import cz.muni.fi.pv243.model.Volume;

@Stateless
public class LoanService extends AbstractService<Loan> {
    public LoanService() {
        super(Loan.class);
    }

    @Inject
    private UserService userService;

    @Inject
    private VolumeService volumeService;

    private void processUser(Loan loan) {
        User inputUser = loan.getUser();
        User user = userService.findByEmail(inputUser.getEmail());
        if (user == null)
            throw new ServiceException("User not found");
        loan.setUser(user);
    }

    private void processVolume(Loan loan) {
        Volume volume = volumeService.findByBarcode(loan.getVolume().getBarcodeId());
        if (volume == null)
            throw new ServiceException("Volume not found");
        for (Loan existing : volume.getLoans()) {
            if (existing.getReturnDate() == null)
                throw new ServiceException("Volume already lent");
        }
        loan.setVolume(volume);
    }

    @Override
    public void create(Loan loan) {
        processUser(loan);
        processVolume(loan);
        if (loan.getLoanDate() == null)
            loan.setLoanDate(new Date(Calendar.getInstance().getTimeInMillis()));
        super.create(loan);
    }
}
