package cz.muni.fi.pv243.service;

import javax.ejb.Stateless;

import cz.muni.fi.pv243.model.User;

@Stateless
public class UserService extends AbstractService<User> {
    public UserService() {
        super(User.class);
    }

    @Override
    public User findById(Object id) {
        User user = super.findById(id);
        if (user != null && user.getLoans() != null)
            user.getLoans().size();
        return user;
    }
}
