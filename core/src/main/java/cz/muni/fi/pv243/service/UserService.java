package cz.muni.fi.pv243.service;

import javax.ejb.Stateless;
import javax.persistence.NoResultException;

import cz.muni.fi.pv243.model.User;

@Stateless
public class UserService extends AbstractService<User> {
    public UserService() {
        super(User.class);
    }

    public User findByEmail(String email) {
        try {
            User user = em.createQuery("from User where email = :email", User.class)
                    .setParameter("email", email)
                    .getSingleResult();
            load(user);
            return user;
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public User findById(Object id) {
        User user = super.findById(id);
        load(user);

        return user;
    }

    private void load(User user) {
        if (user != null && user.getLoans() != null)
            user.getLoans().size();
    }
}
