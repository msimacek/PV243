package cz.muni.fi.pv243.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceUnitUtil;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public abstract class AbstractService<T> {
    private Class<T> clazz;

    @PersistenceContext(unitName = "pv243-persistence-unit")
    protected EntityManager em;

    public AbstractService(Class<T> clazz) {
        this.clazz = clazz;
    }

    public Object getEntityId(T entity) {
        PersistenceUnitUtil util = em.getEntityManagerFactory().getPersistenceUnitUtil();
        return util.getIdentifier(entity);
    }

    public void create(T entity) {
        em.persist(entity);
    }

    public void delete(T entity) {
        em.remove(entity);
    }

    public T findById(Object id) {
        return em.find(clazz, id);
    }

    public List<T> findAll() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(clazz);
        Root<T> from = cq.from(clazz);
        cq.select(from);
        TypedQuery<T> query = em.createQuery(cq);
        return query.getResultList();
    }

    public void update(T entity) {
        em.merge(entity);
    }
}
