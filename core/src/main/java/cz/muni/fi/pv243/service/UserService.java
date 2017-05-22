package cz.muni.fi.pv243.service;

import javax.ejb.Stateless;

import cz.muni.fi.pv243.model.User;

@Stateless
public class UserService extends AbstractService<User> {
    public UserService() {
        super(User.class);
    }
}
