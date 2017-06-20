package cz.muni.fi.pv243.messaging;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Queue;

@Stateless
public class Sender {

    @Resource(mappedName = "java:jboss/jms/queue/myQueue")
    private Queue queue;

    @Inject
    JMSContext context;

    public void sendMessage(String message) {
        try {
            context.createProducer().send(queue, message);
        } catch (Exception exc) {
            exc.printStackTrace();
        }

    }
}
