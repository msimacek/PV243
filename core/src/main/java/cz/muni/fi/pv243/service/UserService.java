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
            return em.createQuery("from User where email = :email", User.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public User findById(Object id) {
        User user = super.findById(id);
        if (user != null && user.getLoans() != null)
            user.getLoans().size();
        return user;
    }
}
