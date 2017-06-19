package cz.muni.fi.pv243.rest;

import java.util.HashMap;
import java.util.Map;

import javax.ejb.EJBTransactionRolledbackException;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import cz.muni.fi.pv243.service.ServiceException;

// based on https://github.com/dwyerj878/warp/blob/master/services/src/main/java/net/dev/jcd/exception/RollbackExceptionMapper.java
@Provider
public class RollbackExceptionMapper implements ExceptionMapper<EJBTransactionRolledbackException> {

    @Override
    public Response toResponse(EJBTransactionRolledbackException exception) {
        int status = 500;
        Exception foundException = exception;
        ServiceException serviceException = findCause(ServiceException.class, exception);
        if (serviceException != null) {
            foundException = serviceException;
            status = 400;
        }
        ConstraintViolationException violationException = findCause(ConstraintViolationException.class, exception);
        if (violationException != null) {
            foundException = violationException;
            status = 400;
        }

        Map<String, String> responseObj = new HashMap<String, String>();
        responseObj.put("error", foundException.getLocalizedMessage());

        return Response.status(status).entity(responseObj).build();
    }

    @SuppressWarnings("unchecked")
    <T> T findCause(Class<T> clz, EJBTransactionRolledbackException e) {
        Throwable ex = e;
        while (true) {
            if (ex.getClass().equals(clz))
                return (T) ex;
            if (ex.getCause() == null || ex.getCause() == ex)
                break;
            ex = ex.getCause();
        }

        return null;

    }
}
