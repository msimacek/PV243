package cz.muni.fi.pv243.messaging;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;

import com.google.gson.Gson;

@MessageDriven(activationConfig = {
        @ActivationConfigProperty(propertyName = "destination", propertyValue = "java:/jboss/exported/jms/queue/myQueue"),
        @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge"),
        @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue")
})
public class Listener implements MessageListener {

    @Override
    public void onMessage(Message message) {
        try {
            String json = message.getBody(String.class);
            JMSMessage msg = new Gson().fromJson(json, JMSMessage.class);
            System.out.println("A new copy of the book " + msg.getBookTitle() + "has just been ordered.");

            // code to order book

        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
