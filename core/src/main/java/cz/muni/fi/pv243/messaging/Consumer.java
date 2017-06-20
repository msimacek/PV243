package cz.muni.fi.pv243.messaging;

import javax.annotation.Resource;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.Queue;

@RequestScoped
public class Consumer {

    @Inject
    private JMSContext context;

    private JMSConsumer consumer;

    @Resource(mappedName = "java:/jms/queue/myQueue")
    Queue queue;

    public Consumer() {
        consumer = context.createConsumer(queue);
        consumer.setMessageListener(new Listener());
    }

    public void endReceiver() {
        consumer.close();
    }
}