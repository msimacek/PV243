package cz.muni.fi.pv243.messaging;

import java.time.Instant;
import java.util.Date;


import cz.muni.fi.pv243.model.Volume;

public class JMSMessage {

    private String bookTitle;

    private String bookISBN;

    private long barcode;

    private EStatus status;

    private Date date = Date.from(Instant.now());

    public JMSMessage(Volume volume, EStatus status) {
        if (status == EStatus.ARCHIVED)
            throw new UnsupportedOperationException("Archiving volumes is not yet supported.");

        this.bookTitle = volume.getBook().getTitle();
        this.bookISBN = volume.getBook().getISBN();
        this.barcode = volume.getBarcodeId();
        this.status = status;
    }

    public JMSMessage(Volume volume, EStatus status, Date date) {
        this(volume, status);
        this.date = date;

    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public String getBookISBN() {
        return bookISBN;
    }

    public void setBookISBN(String bookISBN) {
        this.bookISBN = bookISBN;
    }

    public long getBarcode() {
        return barcode;
    }

    public void setBarcode(long barcode) {
        this.barcode = barcode;
    }

    public EStatus getStatus() {
        return status;
    }

    public void setStatus(EStatus status) {
        this.status = status;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
