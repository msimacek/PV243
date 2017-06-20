package cz.muni.fi.pv243.rest;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/websocket/")
public class WebsocketEndpoint {

    @OnMessage
    public String returnVolume(String name) {
        return "The volume of " + name + " has just been returned.";
    }

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("WebSocket opened: " + session.getId());
    }

    @OnClose
    public void onClose(CloseReason reason) {
        System.out.println("WebSocket connection closed with CloseCode: " + reason.getCloseCode());
    }

}
