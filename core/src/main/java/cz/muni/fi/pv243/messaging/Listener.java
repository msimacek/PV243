package cz.muni.fi.pv243.messaging;

import javax.ejb.Stateless;
import javax.jms.Message;
import javax.jms.MessageListener;

@Stateless
public class Listener implements MessageListener {

    @Override
    public void onMessage(Message message) {
        System.out.println("received: " + message);
    }
}
